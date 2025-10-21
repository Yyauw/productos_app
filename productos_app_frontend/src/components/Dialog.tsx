import { Dialog as PrimeDialog } from "primereact/dialog";

interface DialogProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  header: string;
  body: string;
}

export default function CustomDialog({
  visible,
  setVisible,
  header,
  body,
}: DialogProps) {
  return (
    <PrimeDialog
      header={header}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <p className="m-0">{body}</p>
    </PrimeDialog>
  );
}
