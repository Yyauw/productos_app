import { Usuario } from "./Usuario";
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: boolean;
  usuarioCreacionId: string;
  fechaCreacion: string;
  usuarioModificacionId: string | null;
  fechaModificacion: string | null;
  usuarioCreacion: Usuario | null;
}
