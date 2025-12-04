import { ConfirmDialog } from '@/components/confirm-dialog'
import { useAuth } from '@/contexts/auth-context';
import { signOut } from '@/service/auth-service';
import Cookies from 'js-cookie';
import { useState } from 'react'
import { toast } from 'sonner';

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const [isLoading, setIsLoaing] = useState(false);
  const {setIsAuThenticated} = useAuth();
  const handleSignOut = () => {
     if (isLoading) return;
     setIsLoaing(true);
     signOut().then(res => {
        toast.success(res);
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        setIsAuThenticated(false);
     }).catch(err => {
        console.log(err);
        setIsLoaing(false)
     }).finally(() => {
        setIsLoaing(false);
     })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText='Sign out'
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}