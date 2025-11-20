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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface SegmentCriterion {
  id: string;
  field: string;
  operator: string;
  value: string | number | string[];
}

interface CustomSegmentCreatorProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Field definitions for query builder
const AVAILABLE_FIELDS = [
  { value: 'plan', label: 'Plan', type: 'select', options: ['FREE', 'PRO', 'PREMIUM'] },
  { value: 'currentStreak', label: 'Current Streak', type: 'number' },
  { value: 'totalPoints', label: 'Total Points', type: 'number' },
  { value: 'level', label: 'Level', type: 'number' },
  { value: 'lastActivityAt', label: 'Last Activity', type: 'date' },
  { value: 'createdAt', label: 'Created Date', type: 'date' },
  { value: 'email', label: 'Email', type: 'text' },
  { value: 'firstName', label: 'First Name', type: 'text' },
  { value: 'lastName', label: 'Last Name', type: 'text' },
];

const OPERATORS = {
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
  ],
  text: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
  ],
  select: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'in', label: 'In' },
  ],
  date: [
    { value: 'greater_than', label: 'After' },
    { value: 'less_than', label: 'Before' },
  ],
};

export function CustomSegmentCreator({ open, onClose, onSuccess }: CustomSegmentCreatorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState<SegmentCriterion[]>([]);
  const [combineWith, setCombineWith] = useState<'AND' | 'OR'>('AND');
  const [showPreview, setShowPreview] = useState(false);

  const previewQuery = api.adminAudience.previewSegment.useQuery(
    {
      criteria: criteria.map((c) => ({
        field: c.field,
        operator: c.operator,
        value: c.value,
      })),
      combineWith,
      sampleSize: 10,
    },
    { enabled: showPreview && criteria.length > 0 }
  );

  const createMutation = api.adminAudience.createCustomSegment.useMutation({
    onSuccess: () => {
      toast.success('Custom segment created successfully');
      onSuccess?.();
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClose = () => {
    setName('');
    setDescription('');
    setCriteria([]);
    setCombineWith('AND');
    setShowPreview(false);
    onClose();
  };

  const addCriterion = () => {
    const newCriterion: SegmentCriterion = {
      id: Math.random().toString(36).substring(7),
      field: 'plan',
      operator: 'equals',
      value: '',
    };
    setCriteria([...criteria, newCriterion]);
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter((c) => c.id !== id));
  };

  const updateCriterion = (id: string, updates: Partial<SegmentCriterion>) => {
    setCriteria(
      criteria.map((c) => {
        if (c.id === id) {
          // If field changed, reset operator and value
          if (updates.field && updates.field !== c.field) {
            const field = AVAILABLE_FIELDS.find((f) => f.value === updates.field);
            return {
              ...c,
              ...updates,
              operator: OPERATORS[field?.type as keyof typeof OPERATORS]?.[0]?.value || 'equals',
              value: '',
            };
          }
          return { ...c, ...updates };
        }
        return c;
      })
    );
  };

  const getFieldType = (fieldValue: string) => {
    return AVAILABLE_FIELDS.find((f) => f.value === fieldValue)?.type || 'text';
  };

  const getOperatorsForField = (fieldValue: string) => {
    const fieldType = getFieldType(fieldValue);
    return OPERATORS[fieldType as keyof typeof OPERATORS] || OPERATORS.text;
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a segment name');
      return;
    }

    if (criteria.length === 0) {
      toast.error('Please add at least one criterion');
      return;
    }

    createMutation.mutate({
      name,
      description,
      criteria: criteria.map((c) => ({
        field: c.field,
        operator: c.operator,
        value: c.value,
      })),
      combineWith,
      isActive: true,
    });
  };

  const renderValueInput = (criterion: SegmentCriterion) => {
    const field = AVAILABLE_FIELDS.find((f) => f.value === criterion.field);

    if (field?.type === 'select' && field.options) {
      return (
        <Select
          value={criterion.value as string}
          onValueChange={(value) => updateCriterion(criterion.id, { value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field?.type === 'number') {
      return (
        <Input
          type="number"
          value={criterion.value as number}
          onChange={(e) =>
            updateCriterion(criterion.id, { value: parseInt(e.target.value) || 0 })
          }
          placeholder="Enter number"
        />
      );
    }

    return (
      <Input
        type="text"
        value={criterion.value as string}
        onChange={(e) => updateCriterion(criterion.id, { value: e.target.value })}
        placeholder="Enter value"
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Segment</DialogTitle>
          <DialogDescription>
            Build a custom audience segment using the query builder
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="segment-name">Segment Name *</Label>
              <Input
                id="segment-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., High-Value Active Users"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="segment-description">Description</Label>
              <Textarea
                id="segment-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe who should be in this segment..."
                className="mt-1"
                rows={2}
              />
            </div>
          </div>

          {/* Criteria Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Query Criteria</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Combine with:</span>
                <Select
                  value={combineWith}
                  onValueChange={(value: 'AND' | 'OR') => setCombineWith(value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {criteria.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No criteria added yet. Click "Add Criterion" to start building your query.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {criteria.map((criterion, index) => (
                  <Card key={criterion.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-2">
                        {index > 0 && (
                          <Badge variant="outline" className="mt-2">
                            {combineWith}
                          </Badge>
                        )}
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          {/* Field */}
                          <Select
                            value={criterion.field}
                            onValueChange={(value) =>
                              updateCriterion(criterion.id, { field: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AVAILABLE_FIELDS.map((field) => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Operator */}
                          <Select
                            value={criterion.operator}
                            onValueChange={(value) =>
                              updateCriterion(criterion.id, { operator: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOperatorsForField(criterion.field).map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Value */}
                          {renderValueInput(criterion)}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeCriterion(criterion.id)}
                          className="mt-0.5"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button variant="outline" onClick={addCriterion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Criterion
            </Button>
          </div>

          {/* Preview */}
          {criteria.length > 0 && (
            <div>
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>

              {showPreview && (
                <Card className="mt-3">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Segment Preview ({previewQuery.data?.matchingUsers || 0} matching users)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {previewQuery.isLoading ? (
                      <div className="text-center py-4 text-muted-foreground">
                        Loading preview...
                      </div>
                    ) : previewQuery.data?.sampleUsers.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No users match these criteria
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground mb-2">
                          Sample users (showing {previewQuery.data?.sampleUsers.length || 0} of{' '}
                          {previewQuery.data?.matchingUsers || 0}):
                        </p>
                        {previewQuery.data?.sampleUsers.map((user) => (
                          <div
                            key={user.userId}
                            className="flex items-center justify-between p-2 bg-muted rounded"
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                            <Badge>{user.plan || 'FREE'}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Segment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
