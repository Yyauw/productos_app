"use client";
import React, { useState, useEffect, useRef } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { useRouter } from "next/navigation";
import ConfirmacionDialog, { ConfirmarRef } from "./ConfirmacionDialog";
import { ProductoTabla } from "@/types/ProductoTabla";
import { jwtDecode } from "jwt-decode";
import { datosUsuarioToken } from "@/types/DatosUsuarioToken";

interface ListaProductosProps {
  data: ProductoTabla[];
}

export default function TablaProductos({ data }: ListaProductosProps) {
  const confirmarRef = useRef<ConfirmarRef>(null);
  const [productos, setProductos] = useState<ProductoTabla[]>(data);
  const [token, setToken] = useState<string>("");
  const [productoAEliminar, setProductoAEliminar] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [rol, setRol] = useState<string>("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const router = useRouter();
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    precio: { value: null, matchMode: FilterMatchMode.EQUALS },
    "usuarioCreacion.nombre": {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    estado: { value: null, matchMode: FilterMatchMode.EQUALS },
    fechaCreacion: { value: null, matchMode: FilterMatchMode.DATE_IS },
  });

  const estados = [
    { label: "Activo", value: true },
    { label: "Inactivo", value: false },
  ];

  //INICIALIZACION DE PRODUCTOS
  useEffect(() => {
    setProductos(data);
  }, [data]);

  //VERIFICACION DE PERMISOS
  useEffect(() => {
    const tokenLS = localStorage.getItem("token") || "";
    setToken(tokenLS);
    if (tokenLS) {
      try {
        const decodedToken: datosUsuarioToken = jwtDecode(tokenLS);
        setRol(decodedToken.role.toString());
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
    setLoading(false);
  }, []);

  // LISTENER PARA SABER CUANDO ELIMINAR PRODUCTO
  useEffect(() => {
    if (productoAEliminar !== null) {
      confirmarRef.current?.confirm2();
    }
  }, [productoAEliminar]);

  //GENERACION DE REPORTES
  const generarReporte = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/reporte/descargar-pdf",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar el reporte");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("No se pudo generar el reporte");
    }
  };

  //ELIMINAR PRODUCTO
  const eliminarProducto = async () => {
    console.log(productoAEliminar);
    try {
      const response = await fetch(
        `http://localhost:5000/api/producto/${productoAEliminar}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar));
      setProductoAEliminar(null);

      if (!response.ok) {
        throw new Error("Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo eliminar producto");
    }
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value },
    }));
    setGlobalFilterValue(value);
  };

  const estadoTemplate = (rowData: ProductoTabla) => (
    <Tag
      value={rowData.estado ? "Activo" : "Inactivo"}
      severity={rowData.estado ? "success" : "danger"}
    />
  );

  const estadoFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => (
    <Dropdown
      value={options.value}
      options={estados}
      onChange={(e: DropdownChangeEvent) =>
        options.filterApplyCallback(e.value)
      }
      optionLabel="label"
      placeholder="Seleccionar"
      className="p-column-filter"
      showClear
    />
  );

  const fechaFilterTemplate = (options: ColumnFilterElementTemplateOptions) => (
    <Calendar
      value={options.value}
      onChange={(e) => options.filterApplyCallback(e.value)}
      dateFormat="yy-mm-dd"
      placeholder="Filtrar por fecha"
      className="p-column-filter"
      showIcon
    />
  );

  const fechaBodyTemplate = (rowData: ProductoTabla) => {
    const date = new Date(rowData.fechaCreacion);
    return date.toLocaleDateString("es-PA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  //ACCIONES CRUD
  const accionesTemplate = (rowData: ProductoTabla) => (
    <div className="flex gap-2 justify-content-center">
      <Button
        label="Ver"
        severity="info"
        tooltip="Ver"
        size="small"
        onClick={() => router.push("productos/" + rowData.id)}
      />
      <Button
        label="Editar"
        severity="warning"
        tooltip="Editar"
        size="small"
        disabled={rol != "Admin"}
        onClick={() => router.push(`productos/${rowData.id}/editar`)}
      />
      <Button
        label="Eliminar"
        severity="danger"
        tooltip="Eliminar"
        size="small"
        disabled={rol != "Admin"}
        onClick={() => {
          setProductoAEliminar(rowData.id);
        }}
      />
    </div>
  );

  const header = (
    <>
      {rol != "Admin" && <p>No eres Admin, acciones limitadas!</p>}
      <div className="grid md:grid-cols-2 gap-2">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar producto..."
        />

        <div className="grid grid-cols-2 gap-2">
          <Button
            severity="success"
            onClick={() => router.push("productos/crear")}
            disabled={rol != "Admin"}
          >
            Agregar Producto
          </Button>
          <Button
            severity="warning"
            onClick={() => generarReporte()}
            disabled={rol != "Admin"}
          >
            Generar Reporte
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="card">
      <ConfirmacionDialog
        ref={confirmarRef}
        msg="Estas seguro que quieres eliminar este producto?"
        header="Cuidado!"
        functionToExecute={eliminarProducto}
      />
      <DataTable
        value={productos}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        globalFilterFields={["nombre", "usuarioCreacion.nombre", "precio"]}
        header={header}
        emptyMessage="No se encontraron productos."
        responsiveLayout="scroll"
      >
        <Column
          field="nombre"
          header="Nombre"
          filter
          filterPlaceholder="Buscar por nombre"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="precio"
          header="Precio"
          filter
          filterPlaceholder="Buscar por precio"
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="usuarioCreacion.nombre"
          header="Creado por"
          filter
          filterPlaceholder="Buscar por usuario"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="estado"
          header="Estado"
          body={estadoTemplate}
          filter
          filterElement={estadoFilterTemplate}
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="fechaCreacion"
          header="Fecha de creación"
          body={fechaBodyTemplate}
          filter
          dataType="date"
          filterElement={fechaFilterTemplate}
          style={{ minWidth: "13rem" }}
        />
        <Column
          header="Acciones"
          body={accionesTemplate}
          exportable={false}
          style={{ minWidth: "10rem", textAlign: "center" }}
        />
      </DataTable>
    </div>
  );
}
