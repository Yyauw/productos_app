"use client";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Producto } from "@/types/Producto";
import CustomDialog from "@/components/Dialog";
import { useRouter } from "next/navigation";

interface ProductoAAgregar {
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Estado: boolean;
}

export default function CrearProductosPage() {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(false);
  const [fueProductoCreado, setFueProductoCreado] = useState<boolean>(false);
  const [dialogHeader, setDialogHeader] = useState<string>("");
  const [dialogBody, setDialogBody] = useState<string>("");
  const [producto, setProducto] = useState<ProductoAAgregar>({
    Nombre: "",
    Descripcion: "",
    Precio: 0,
    Estado: true,
  });

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
    crearProducto();
  };

  const crearProducto = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/producto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const productoCreado: Producto = data.data;

      // Setear mensajes del dialog
      setDialogHeader("Accion exitosa");
      setDialogBody(`Producto ${productoCreado.nombre} creado con exito!`);
      setVisible(true);
      setFueProductoCreado(true);
    } catch (err) {
      alert("ah ocurrido un error");
    }
  };

  //Para redirigir solo cuando el usuario cierra el dialog
  useEffect(() => {
    if (fueProductoCreado && !visible) router.push("/productos");
  }, [visible]);

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
          Registrar Producto
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
            required
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
            required
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
          label="Guardar Producto"
          icon="pi pi-check"
          className="w-full"
        />
      </form>
    </>
  );
}
