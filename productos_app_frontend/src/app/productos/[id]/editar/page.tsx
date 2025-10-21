"use client";

import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import CustomDialog from "@/components/Dialog";

interface Producto {
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Estado: boolean;
}

export default function EditarProductosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(false);
  const [fueProductoEditado, setFueProductoEditado] = useState<boolean>(false);
  const [dialogHeader, setDialogHeader] = useState<string>("");
  const [dialogBody, setDialogBody] = useState<string>("");

  const [producto, setProducto] = useState<Producto>({
    Nombre: "",
    Descripcion: "",
    Precio: 0,
    Estado: true,
  });

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/producto/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        console.log(data);
        const productoAMostrar: Producto = {
          Nombre: data.nombre,
          Descripcion: data.descripcion,
          Precio: data.precio,
          Estado: data.estado,
        };
        setProducto(productoAMostrar);
      } catch (err) {
        alert("error al cargar el producto");
      }
    };
    fetchProducto();
  }, [id]);

  //Para redirigir solo cuando el usuario cierra el dialog
  useEffect(() => {
    if (fueProductoEditado && !visible) router.push(`/productos/${id}`);
  }, [visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //VALIDACION DE DATOS
    if (
      !producto.Nombre.trim() ||
      producto.Precio <= 0 ||
      !producto.Descripcion.trim()
    ) {
      setDialogHeader("Error");
      setDialogBody("Datos invalidos!");
      setVisible(true);
      return;
    }
    editarProducto();
  };

  const editarProducto = async () => {
    const token = localStorage.getItem("token") || "";
    try {
      const response = await fetch(`http://localhost:5000/api/producto/${id}`, {
        method: "PUT", // o PATCH según tu API
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: producto.Nombre,
          descripcion: producto.Descripcion,
          precio: producto.Precio,
          estado: producto.Estado,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }
      setDialogHeader("Accion exitosa");
      setDialogBody(`Producto editado con exito!`);
      setVisible(true);
      setFueProductoEditado(true);
    } catch (error) {
      setDialogHeader("Error");
      setDialogBody(`Ah ocurrido un error`);
    }
  };

  return (
    <>
      <CustomDialog
        setVisible={setVisible}
        visible={visible}
        header={dialogHeader}
        body={dialogBody}
      />
      <form
        onSubmit={handleSubmit}
        className="w-full md:m-4 p-4 bg-gray-100 md:rounded-2xl shadow-md "
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Editar Producto
        </h2>

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label htmlFor="nombre" className="font-medium">
            Nombre
          </label>
          <InputText
            id="nombre"
            value={producto.Nombre}
            onChange={(e) =>
              setProducto({ ...producto, Nombre: e.target.value })
            }
            placeholder="Ej: Producto 2"
            className="w-full"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label htmlFor="descripcion" className="font-medium">
            Descripción
          </label>
          <InputTextarea
            id="descripcion"
            value={producto.Descripcion}
            onChange={(e) =>
              setProducto({ ...producto, Descripcion: e.target.value })
            }
            placeholder="Descripción del producto"
            rows={3}
            className="w-full"
          />
        </div>

        {/* Precio */}
        <div className="flex flex-col gap-1">
          <label htmlFor="precio" className="font-medium">
            Precio
          </label>
          <InputNumber
            id="precio"
            value={producto.Precio}
            onValueChange={(e) =>
              setProducto({ ...producto, Precio: e.value || 0 })
            }
            mode="currency"
            currency="USD"
            locale="es-ES"
            className="w-full"
          />
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2 my-4">
          <Checkbox
            inputId="estado"
            checked={producto.Estado}
            onChange={(e) =>
              setProducto({ ...producto, Estado: e.checked ?? false })
            }
          />
          <label htmlFor="estado" className="cursor-pointer">
            Activo
          </label>
        </div>

        {/* Botón */}
        <Button
          type="submit"
          label="Editar Producto"
          icon="pi pi-check"
          className="w-full"
        />
      </form>
    </>
  );
}
