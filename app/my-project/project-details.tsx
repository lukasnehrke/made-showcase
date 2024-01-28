'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { Switch } from '@/components/ui/switch';
import { updateProject } from '@/actions/update-project';

function SubmitButton({ dirty }: { dirty: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={!dirty} type="submit">
      {pending ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
      Save Changes
    </Button>
  );
}

interface ProjectDetailsProps {
  id: string;
  hidden: boolean;
  title: string;
  summary: string;
}

export function ProjectDetails(props: ProjectDetailsProps) {
  const [state, formAction] = useFormState(updateProject, {
    ok: true,
    message: '',
    project: {
      hidden: props.hidden,
      title: props.title,
      summary: props.summary,
    },
  });

  const [dirty, setDirty] = useState(false);
  const [hidden, setHidden] = useState(props.hidden);
  const [title, setTitle] = useState(props.title);
  const [summary, setSummary] = useState(props.summary);

  useEffect(() => {
    if (state.ok) {
      if (state.message) {
        toast.success(state.message);
      }
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    setDirty(hidden !== state.project?.hidden || title !== state.project.title || summary !== state.project.summary);
  }, [state, hidden, title, summary]);

  return (
    <form action={formAction}>
      <input name="id" type="hidden" value={props.id} />
      <div className="grid grid-cols-2 gap-x-14 gap-y-8">
        <div>
          <h2 className="text-lg font-medium">Hide Project</h2>
          <p className="text-sm text-gray-500">This option hides your project from the showcase.</p>
        </div>
        <div className="flex items-center">
          <Switch
            checked={hidden}
            name="hidden"
            onCheckedChange={(checked) => {
              setHidden(checked);
            }}
          />
          <p className="text-sm font-medium ml-4">{hidden ? 'Your project is hidden' : 'Your project is visible'}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium">Project Title</h2>
          <p className="text-sm text-gray-500">A short title for your project.</p>
        </div>
        <Input
          name="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
          value={title}
        />

        <div>
          <h2 className="text-lg font-medium">Project Summary</h2>
          <p className="text-sm text-gray-500">A brief summary of your project.</p>
        </div>
        <Textarea
          name="summary"
          onChange={(e) => {
            setSummary(e.target.value);
          }}
          required
          value={summary}
        />
      </div>
      <Divider className="mt-8 mb-4" />
      <div className="flex items-center justify-end">
        <SubmitButton dirty={dirty} />
      </div>
    </form>
  );
}
