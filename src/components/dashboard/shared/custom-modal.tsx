'use client';

// Provider
import { useModal } from '@/providers/modal-provider';

// UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Props = {
  heading?: string;
  subheading?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  maxWidth?: string;
};

const CustomModal = ({
  children,
  defaultOpen,
  subheading,
  heading,
  maxWidth,
}: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent
        className={cn(
          'overflow-y-scroll md:max-h-[700px] md:h-fit h-screen bg-card',
          maxWidth
        )}
        style={{ zIndex: 50 }}
      >
        <DialogHeader className='pt-8 text-left'>
          <DialogTitle className={!heading ? 'sr-only' : 'text-2xl font-bold'}>
            {heading || 'Dialog'}
          </DialogTitle>
          {subheading && <DialogDescription>{subheading}</DialogDescription>}

          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
