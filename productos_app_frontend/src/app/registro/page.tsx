"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import CustomDialog from "@/components/Dialog";
import { Dropdown } from "primereact/dropdown";
import { useRouter } from "next/navigation";

interface Rol {
  rol: string;
  codigo: number;
}

interface responseData {
  msg?: string;
  token?: string;
}

export default function RegistroPage() {
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const router = useRouter();
  const roles: Rol[] = [
    { rol: "Usuario", codigo: 2 },
    { rol: "Administrador", codigo: 1 },
  ];
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Handle login logic here
    if (!nombre || !email || !password || !selectedRol) {
      setVisible(true);
      return;
    }
    registrarUsuario(email, password, nombre, selectedRol);
  };

  const registrarUsuario = async (
    email: string,
    password: string,
    nombre: string,
    selectedRol: Rol
  ) => {
    try {
      // Lógica de creacion de usuario
      const res = await fetch("http://localhost:5000/api/usuario/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
          Nombre: nombre,
          Rol: selectedRol?.codigo,
        }),
      });

      const data: responseData = await res.json();
      // Manejar errores de red o respuestas no exitosas
      if (!res.ok) {
        setVisible(true);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      if (data.token) localStorage.setItem("token", data.token);
      router.push("/productos");
    } catch (error) {
      console.error("Error during user validation:", error);
      setVisible(true);
    }
  };

  return (
    <div className="bg-linear-to-r/srgb from-indigo-500 to-teal-400 w-screen h-screen flex flex-row">
      <CustomDialog
        setVisible={setVisible}
        visible={visible}
        header="Error de registro"
        body="Por favor complete todos los campos correctamente."
      />
      <section className="md:h-auto h-screen  bg-gray-200/80 flex m-auto shadow-lg p-10 w-md rounded-2xl">
        <div className="flex flex-col  w-full justify-center">
          <h1 className="text-center text-4xl font-bold tracking-wider uppercase text-gray-800">
            Registro
          </h1>
          <form className="my-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-2">
              <label htmlFor="Email">Nombre</label>
              <InputText
                id="Nombre"
                className="p-inputtext-lg"
                required
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="Email">Email</label>
              <InputText
                id="Email"
                keyfilter="email"
                className="p-inputtext-lg"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 mt-2 mb-2">
              <label htmlFor="Password">Clave</label>
              <Password
                id="Password"
                inputStyle={{ width: "100%" }}
                feedback={false}
                className="p-inputtext-lg"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 mt-2 mb-4">
              <label htmlFor="Rol">Rol</label>
              <Dropdown
                value={selectedRol}
                onChange={(e) => setSelectedRol(e.value)}
                options={roles}
                optionLabel="rol"
                placeholder="Seleccionar Rol"
                className="w-full md:w-14rem"
              />
              <small>Esta opcion esta aqui como demostracion</small>
            </div>

            <Button
              type="submit"
              className="w-full"
              label="Registrarse"
              size="large"
            />
          </form>
          <Divider />
          <div>
            <p className="text-center text-xl mb-1">Ya tienes cuenta?</p>
            <Button
              className="w-full mt-4"
              label="Logearse"
              size="large"
              severity="success"
              onClick={() => router.push("/login")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
