import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { describe, it, expect, vi } from 'vitest';

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-primary');
    });

    it('renders loading state correctly', () => {
        render(<Button isLoading>Click Me</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
        // Check for spinner SVG (simplified check)
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies variant classes', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-red-500/10');
    });
});
