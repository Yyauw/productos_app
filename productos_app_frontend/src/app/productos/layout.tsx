"use client";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { datosUsuarioToken } from "@/types/DatosUsuarioToken";

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: datosUsuarioToken = jwtDecode(token);
        setNombreUsuario(decodedToken.unique_name);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirigir al login
      }
    } else {
      // No hay token, redirigir al login
      window.location.href = "/login";
    }
  }, []);

  return (
    <section className="bg-gray-300 min-w-screen min-h-screen flex flex-row ">
      <div className="container mx-auto">
        {/* HEADER */}
        <div className="w-full bg-blue-500 m-0 md:m-2 p-4 py-10 md:rounded-lg shadow-lg grid md:grid-cols-2 ">
          <p className="text-2xl text-white font-bold">
            Bienvenido {nombreUsuario}
          </p>
          <div className="md:place-self-end">
            <Button
              severity="warning"
              onClick={() => router.push("/productos")}
            >
              Productos
            </Button>
            <Button
              style={{ margin: "0 10px" }}
              severity="danger"
              onClick={() => router.push("/logout")}
            >
              Cerrar sesion
            </Button>
          </div>
        </div>

        {/* CONTENT */}
        {children}
      </div>
    </section>
  );
}
