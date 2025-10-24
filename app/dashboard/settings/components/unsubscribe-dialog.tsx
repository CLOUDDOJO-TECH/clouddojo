"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { LsUserSubscription } from "@prisma/client";
import { format } from "date-fns";

interface UnsubscribeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: LsUserSubscription;
  onSuccess: () => void;
}

const CANCELLATION_REASONS = [
  { value: "too_expensive", label: "Too expensive" },
  { value: "not_using", label: "Not using the service enough" },
  { value: "missing_features", label: "Missing features I need" },
  { value: "technical_issues", label: "Technical issues" },
  { value: "switching_competitors", label: "Switching to a competitor" },
  { value: "temporary_pause", label: "Temporary financial situation" },
  { value: "found_alternative", label: "Found a better alternative" },
  { value: "completed_goals", label: "Achieved my certification goals" },
  { value: "other", label: "Other reason" },
];

export function UnsubscribeDialog({ 
  isOpen, 
  onOpenChange, 
  subscription, 
  onSuccess 
}: UnsubscribeDialogProps) {
  const [step, setStep] = useState<'confirm' | 'reason' | 'final'>('confirm');
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const cancelMutation = useMutation({
    mutationFn: async ({ subscriptionId, reason }: { subscriptionId: string; reason?: string }) => {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel subscription');
      }

      return response.json();
    },
    onSuccess: () => {
      setStep('final');
      setTimeout(() => {
        onSuccess();
        handleReset();
      }, 3000);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleReset = () => {
    setStep('confirm');
    setSelectedReason('');
    setCustomReason('');
  };

  const handleClose = () => {
    if (!cancelMutation.isPending) {
      onOpenChange(false);
      setTimeout(handleReset, 150);
    }
  };

  const handleCancel = () => {
    const reason = selectedReason === 'other' ? customReason : selectedReason;
    cancelMutation.mutate({
      subscriptionId: subscription.lemonSqueezyId,
      reason: reason || undefined,
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 'confirm':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Cancel Subscription?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your CloudDojo subscription?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                  What happens when you cancel:
                </h4>
                <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                  <li>• Your subscription will remain active until {format(new Date(subscription.renewsAt), 'MMM dd, yyyy')}</li>
                  <li>• You'll lose access to premium features after the billing period ends</li>
                  <li>• Your progress and data will be preserved</li>
                  <li>• You can resubscribe at any time</li>
                  <li>• No refunds for partial periods</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Current Subscription Details</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{subscription.subscriptionPlan?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${(parseFloat(subscription.price) / 100).toFixed(2)}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next billing:</span>
                    <span className="font-medium">{format(new Date(subscription.renewsAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{subscription.statusFormatted || subscription.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Keep Subscription
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setStep('reason')}
              >
                Continue Cancellation
              </Button>
            </DialogFooter>
          </>
        );

      case 'reason':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Help us improve CloudDojo</DialogTitle>
              <DialogDescription>
                We'd love to know why you're cancelling. Your feedback helps us improve the platform for everyone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">What's the main reason for cancelling? (Optional)</Label>
                <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="mt-3">
                  {CANCELLATION_REASONS.map((reason) => (
                    <div key={reason.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason.value} id={reason.value} />
                      <Label htmlFor={reason.value} className="text-sm font-normal cursor-pointer">
                        {reason.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {selectedReason === 'other' && (
                <div>
                  <Label htmlFor="custom-reason" className="text-base font-medium">
                    Please tell us more:
                  </Label>
                  <Textarea
                    id="custom-reason"
                    placeholder="Help us understand how we can improve CloudDojo..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('confirm')}>
                Back
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Skip & Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Subscription'
                )}
              </Button>
            </DialogFooter>
          </>
        );

      case 'final':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Subscription Cancelled
              </DialogTitle>
              <DialogDescription className="text-center">
                Your subscription has been successfully cancelled.
              </DialogDescription>
            </DialogHeader>

            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <p className="font-medium">
                  You'll continue to have access until {format(new Date(subscription.renewsAt), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  You can reactivate your subscription anytime before then to continue uninterrupted access.
                </p>
              </div>
            </div>

            <DialogFooter>
              <div className="text-center w-full">
                <p className="text-xs text-muted-foreground">
                  This dialog will close automatically in a few seconds.
                </p>
              </div>
            </DialogFooter>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}