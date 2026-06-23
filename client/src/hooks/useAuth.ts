import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useAuthStore } from '../store/authStore';
import type { LoginRequest, RegisterRequest } from '@tolovelist/shared';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      window.location.href = '/';
    },
  });
}
