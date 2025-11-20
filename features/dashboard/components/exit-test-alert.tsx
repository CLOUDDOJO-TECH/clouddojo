import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ExitTestAlertProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

export function ExitTestAlert({ isOpen, onClose, onContinue }: ExitTestAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Exit Test?</AlertDialogTitle>
          <AlertDialogDescription>
            You have an ongoing test. If you exit now, your progress will not be saved. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Go Back</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue} className="bg-red-600 hover:bg-red-700">
            Exit Test
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 