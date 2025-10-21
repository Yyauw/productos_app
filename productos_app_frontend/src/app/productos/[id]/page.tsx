"use client";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Producto } from "@/types/Producto";
import { useEffect, useState, use } from "react";

export default function VerProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [producto, setProducto] = useState<Producto | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(apiUrl + `/api/producto/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Producto = await res.json();

        setProducto(data);
      } catch (err) {
        alert("error al obtener producto");
      }
    };

    fetchProducto();
  }, [id]);

  const formatDate = (dateStr: string | null | undefined) =>
    dateStr ? new Date(dateStr).toLocaleString() : "—";

  return (
    <Card
      title={producto?.nombre}
      subTitle={`ID: ${producto?.id}`}
      className="shadow-md w-full md:m-4 p-4 bg-gray-100 rounded-2xl"
    >
      <div className="space-y-3 text-gray-700">
        <p>
          <span className="font-semibold">Descripción:</span>{" "}
          {producto?.descripcion}
        </p>

        <p>
          <span className="font-semibold">Precio:</span> $
          {producto?.precio.toFixed(2)}
        </p>

        <div className="flex items-center gap-2">
          <span className="font-semibold">Estado:</span>
          <Tag
            value={producto?.estado ? "Activo" : "Inactivo"}
            severity={producto?.estado ? "success" : "danger"}
          />
        </div>

        <hr className="my-4" />

        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-semibold">Creado por:</span>{" "}
            {producto?.usuarioCreacion?.nombre}
          </p>
          <p>
            <span className="font-semibold">Fecha creación:</span>{" "}
            {formatDate(producto?.fechaCreacion)}
          </p>
          <p>
            <span className="font-semibold">Modificado por:</span>{" "}
            {producto?.usuarioModificacionId ?? "—"}
          </p>
          <p>
            <span className="font-semibold">Fecha modificación:</span>{" "}
            {formatDate(producto?.fechaModificacion)}
          </p>
        </div>
      </div>
    </Card>
  );
}
