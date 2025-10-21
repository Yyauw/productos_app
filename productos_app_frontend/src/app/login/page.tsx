"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import CustomDialog from "@/components/Dialog";
import { useRouter } from "next/navigation";

interface responseData {
  msg?: string;
  token?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // verificamos que los campos no esten vacios
    if (!email || !password) {
      setVisible(true);
      return;
    }
    validarUsuario(email, password);
  };

  const validarUsuario = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      // Lógica de validación de usuario
      const res = await fetch(apiUrl + "/api/usuario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data: responseData = await res.json();
      // Manejar errores de red o respuestas no exitosas
      if (!res.ok) {
        setVisible(true);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // Guardamos el token si la validación es exitosa
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
        header="Error de login"
        body="Por favor complete todos los campos correctamente."
      />
      <section className="md:h-auto h-screen  bg-gray-200/80 flex m-auto shadow-lg p-10 w-md rounded-2xl">
        <div className="flex flex-col  w-full justify-center">
          <h1 className="text-center text-4xl font-bold tracking-wider uppercase text-gray-800">
            Login
          </h1>
          <form className="my-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="Email">Email</label>
              <InputText
                id="Email"
                keyfilter="email"
                className="p-inputtext-lg"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="flex flex-col gap-2 mt-2 mb-8">
              <label htmlFor="Password">Clave</label>
              <Password
                id="Password"
                inputStyle={{ width: "100%" }}
                feedback={false}
                className="p-inputtext-lg"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              label="Ingresar"
              size="large"
            />
          </form>
          <Divider />
          <div>
            <p className="text-center text-xl mb-1">No tienes cuenta aun?</p>
            <Button
              className="w-full mt-4"
              label="Registrate"
              size="large"
              severity="success"
              onClick={() => router.push("/registro")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
