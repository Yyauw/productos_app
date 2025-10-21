import { Usuario } from "./Usuario";

export interface ProductoTabla {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: boolean;
  usuarioCreacionId: string | null;
  usuarioCreacion: Usuario | null;
  fechaCreacion: Date | string;
}
