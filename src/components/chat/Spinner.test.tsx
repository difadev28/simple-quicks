import { render } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
    it('renders correctly', () => {
        render(<Spinner />);

        const spinner = document.querySelector('svg');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('h-4', 'w-4', 'animate-spin', 'text-primary-blue');
    });

    it('has correct SVG attributes', () => {
        render(<Spinner />);

        const spinner = document.querySelector('svg');
        expect(spinner).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
        expect(spinner).toHaveAttribute('fill', 'none');
        expect(spinner).toHaveAttribute('viewBox', '0 0 24 24');
    });
});