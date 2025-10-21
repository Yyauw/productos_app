"use client";
import TablaConFiltro from "@/components/TablaConFiltro";
import { useEffect, useState } from "react";
import { ProductoTabla } from "@/types/ProductoTabla";

export default function ProductosPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [productos, setProductos] = useState<ProductoTabla[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(apiUrl + "/api/producto");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: ProductoTabla[] = await res.json();
        // Convertir fechas de string a Date
        const parsed = data.map((p) => ({
          ...p,
          fechaCreacion: new Date(p.fechaCreacion),
        }));
        setProductos(parsed);
      } catch (err) {
        alert("error al cargar productos");
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="w-full md:m-1 p-2 md:p-4">
      <TablaConFiltro data={productos} />
    </div>
  );
}
