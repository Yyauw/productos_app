"use client";
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

interface ConfirmacionDialogProps {
  header: string;
  msg: string;
  functionToExecute: () => void;
}

export interface ConfirmarRef {
  confirm2: () => void;
}

const ConfirmacionDialog = forwardRef<ConfirmarRef, ConfirmacionDialogProps>(
  ({ msg, header, functionToExecute }, ref) => {
    const toast = useRef<Toast>(null);

    const accept = () => {
      toast.current?.show({
        severity: "info",
        summary: "Confirmado",
        detail: "Has aceptado",
        life: 3000,
      });
      functionToExecute();
    };

    const reject = () => {
      toast.current?.show({
        severity: "warn",
        summary: "Rechazado",
        detail: "Has cancelado la acción",
        life: 3000,
      });
    };

    const confirm2 = () => {
      confirmDialog({
        message: msg,
        header,
        icon: "pi pi-info-circle",
        defaultFocus: "reject",
        acceptClassName: "p-button-danger",
        accept,
        reject,
      });
    };

    useImperativeHandle(ref, () => ({
      confirm2,
    }));

    return (
      <>
        <Toast ref={toast} />
        <ConfirmDialog />
      </>
    );
  }
);
ConfirmacionDialog.displayName = "ConfirmacionDialog";
export default ConfirmacionDialog;
