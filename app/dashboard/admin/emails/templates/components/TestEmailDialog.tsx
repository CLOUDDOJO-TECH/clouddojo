'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

interface TestEmailDialogProps {
  templateId: string;
  onClose: () => void;
}

export function TestEmailDialog({ templateId, onClose }: TestEmailDialogProps) {
  const [toEmail, setToEmail] = useState('');
  const [customVariables, setCustomVariables] = useState<Record<string, any>>({});

  const { data: template } = api.adminTemplate.getTemplate.useQuery({ id: templateId });

  const sendTestMutation = api.adminTemplate.sendTestEmail.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSend = () => {
    if (!toEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    sendTestMutation.mutate({
      templateId,
      toEmail,
      variables: Object.keys(customVariables).length > 0 ? customVariables : undefined,
    });
  };

  const handleVariableChange = (key: string, value: string) => {
    setCustomVariables((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Test Email</DialogTitle>
          <DialogDescription>
            Send a test version of "{template?.name}" to verify it looks correct
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recipient Email */}
          <div>
            <Label htmlFor="toEmail">Send To *</Label>
            <Input
              id="toEmail"
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1"
              required
            />
          </div>

          {/* Custom Variables */}
          {template?.variables && (template.variables as string[]).length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Test Variables (Optional)</Label>
              <p className="text-xs text-muted-foreground">
                Customize the variables for this test email
              </p>
              {(template.variables as string[]).map((variable) => (
                <div key={variable}>
                  <Label htmlFor={`var-${variable}`} className="text-xs text-muted-foreground">
                    {variable}
                  </Label>
                  <Input
                    id={`var-${variable}`}
                    value={customVariables[variable] || ''}
                    onChange={(e) => handleVariableChange(variable, e.target.value)}
                    placeholder={`Test ${variable}...`}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sendTestMutation.isPending}>
            <Send className="h-4 w-4 mr-2" />
            {sendTestMutation.isPending ? 'Sending...' : 'Send Test Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
