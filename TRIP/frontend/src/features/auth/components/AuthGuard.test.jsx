import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { AuthGuard } from './AuthGuard';
import { useAuthStore } from '../../../store/authStore';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../../../store/authStore', () => ({
  useAuthStore: vi.fn()
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        <Route path="/protected" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when isLoading is true', () => {
    useAuthStore.mockReturnValue({ isLoading: true, isAuthenticated: false, isGuest: false });
    const { container } = renderWithRouter(
      <AuthGuard><div data-testid="protected-content">Content</div></AuthGuard>,
      { route: '/protected' }
    );
    expect(container.querySelector('.animate-spin')).not.toBeNull();
  });

  it('redirects to login when user is not authenticated', () => {
    useAuthStore.mockReturnValue({ isLoading: false, isAuthenticated: false, isGuest: false });
    const { getByTestId } = renderWithRouter(
      <AuthGuard><div data-testid="protected-content">Content</div></AuthGuard>,
      { route: '/protected' }
    );
    expect(getByTestId('login-page')).toBeInTheDocument();
  });

  it('redirects to login when user is a guest', () => {
    useAuthStore.mockReturnValue({ isLoading: false, isAuthenticated: true, isGuest: true });
    const { getByTestId } = renderWithRouter(
      <AuthGuard><div data-testid="protected-content">Content</div></AuthGuard>,
      { route: '/protected' }
    );
    expect(getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders children when user is authenticated and not a guest', () => {
    useAuthStore.mockReturnValue({ isLoading: false, isAuthenticated: true, isGuest: false });
    const { getByTestId } = renderWithRouter(
      <AuthGuard><div data-testid="protected-content">Protected</div></AuthGuard>,
      { route: '/protected' }
    );
    expect(getByTestId('protected-content')).toBeInTheDocument();
  });
});
