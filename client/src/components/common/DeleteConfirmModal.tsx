import React from "react";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title?: string;
    description?: string;
    isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you absolutely sure?",
    description = "This action cannot be undone. This will permanently delete the selected item and remove its data from our servers.",
    isLoading = false
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-[400px] rounded-[2.5rem] border-none p-8 font-sans overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
                
                <AlertDialogHeader className="relative z-10">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 border border-red-100 shadow-sm">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <AlertDialogTitle className="text-xl font-black text-foreground tracking-tight">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-muted-foreground/80 leading-relaxed pt-2">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <AlertDialogFooter className="mt-8 gap-3 relative z-10 sm:justify-end">
                    <AlertDialogCancel asChild>
                        <Button 
                            variant="outline" 
                            className="rounded-xl font-bold h-11 px-6 border-gray-100 bg-white hover:bg-gray-50 text-xs uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button 
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirm();
                            }}
                            disabled={isLoading}
                            className="rounded-xl font-black h-11 px-6 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 text-xs uppercase tracking-widest transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Anyway</>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmModal;
