import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomDialogProps {
  title: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
  description?: ReactNode;
  maxWidth?: string;
}

export function CustomDialog({
  title,
  isOpen,
  handleClose,
  description,
  maxWidth = "max-w-sm",
}: CustomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description}
      </DialogContent>
    </Dialog>
  );
}
