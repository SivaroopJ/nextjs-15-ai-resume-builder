// __tests__/components/ResumeItem.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResumeItem from '@/app/(main)/resumes/ResumeItem';
import { ResumeServerData } from '@/lib/types';
import { formatDate } from 'date-fns';
import * as utils from '@/lib/utils';
import { deleteResume } from '@/app/(main)/resumes/actions';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('@/lib/utils', () => ({
  mapToResumeValues: jest.fn((resume) => resume),
}));

jest.mock('./actions', () => ({
  deleteResume: jest.fn(),
}));

jest.mock('react-to-print', () => ({
  useReactToPrint: jest.fn(() => jest.fn()),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock ResumePreview component
jest.mock('@/components/ResumePreview', () => {
  return function MockResumePreview({ resumeData, contentRef, className }) {
    return <div ref={contentRef} className={className}>Resume Preview</div>;
  };
});


describe('ResumeItem Component', () => {
  it('should render a resume item with title, company, date, and description', () => {
    const props = {
      title: 'Software Engineer',
      company: 'ABC Corp',
      date: 'January 2020 - Present',
      description: 'Worked on various software development projects.',
    };

    render(<ResumeItem {...props} />);

    // Check if the title, company, date, and description are rendered
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('ABC Corp - January 2020 - Present')).toBeInTheDocument();
    expect(screen.getByText('Worked on various software development projects.')).toBeInTheDocument();
  });
});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders resume title, description, and date', () => {
    render(<ResumeItem resume={mockResume} />);

    expect(screen.getByText('Test Resume')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(
      screen.getByText(`Updated on ${formatDate(mockResume.updatedAt, 'MMM d, yyyy h:mm a')}`)
    ).toBeInTheDocument();
  });

  it('shows "Created" when resume wasn\'t updated', () => {
    const notUpdatedResume = {
      ...mockResume,
      updatedAt: mockResume.createdAt,
    };
    render(<ResumeItem resume={notUpdatedResume} />);

    expect(
      screen.getByText(`Created on ${formatDate(mockResume.createdAt, 'MMM d, yyyy h:mm a')}`)
    ).toBeInTheDocument();
  });

  it('renders ResumePreview with mapped data', () => {
    render(<ResumeItem resume={mockResume} />);
    
    expect(screen.getByText('Resume Preview')).toBeInTheDocument();
    expect(utils.mapToResumeValues).toHaveBeenCalledWith(mockResume);
  });

  it('links to editor with correct resume ID', () => {
    render(<ResumeItem resume={mockResume} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/editor?resumeId=${mockResume.id}`);
  });

  it('shows dropdown menu on button click', async () => {
    render(<ResumeItem resume={mockResume} />);
    
    const menuButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(menuButton);

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  it('opens delete confirmation dialog when delete is clicked', async () => {
    render(<ResumeItem resume={mockResume} />);
    
    const menuButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(menuButton);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Delete resume?')).toBeInTheDocument();
      expect(
        screen.getByText('This will permanently delete this resume. This action cannot be undone.')
      ).toBeInTheDocument();
    });
  });

  it('handles successful delete operation', async () => {
    (deleteResume as jest.Mock).mockResolvedValueOnce(undefined);
    
    render(<ResumeItem resume={mockResume} />);
    
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    });

    await waitFor(() => {
      expect(deleteResume).toHaveBeenCalledWith(mockResume.id);
      expect(screen.queryByText('Delete resume?')).not.toBeInTheDocument();
    });
  });

  it('shows error toast when delete fails', async () => {
    const mockError = new Error('Delete failed');
    (deleteResume as jest.Mock).mockRejectedValueOnce(mockError);
    
    render(<ResumeItem resume={mockResume} />);
    
    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    });

    await waitFor(() => {
      expect(deleteResume).toHaveBeenCalledWith(mockResume.id);
      expect(require('sonner').toast.error).toHaveBeenCalledWith(
        'Something went wrong. Please try again.'
      );
    });
  });

  it('handles resume with minimal data', () => {
    const minimalResume: ResumeServerData = {
      id: '2',
      title: null,
      description: null,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      workExperiences: [],
      educations: [],
      projects: [],
    };
    
    render(<ResumeItem resume={minimalResume} />);
    
    expect(screen.getByText('No title')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });
});