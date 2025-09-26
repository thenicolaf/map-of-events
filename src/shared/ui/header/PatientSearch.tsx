'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, User, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'patient';
}

interface PatientSearchProps {
  className?: string;
  isMobile?: boolean;
}

// Mock patient data - in real app this would come from API
const mockPatients: SearchResult[] = [
  { id: 1, name: 'Maria Rodriguez', email: 'maria.rodriguez@email.com', phone: '+1 555-0101', type: 'patient' },
  { id: 2, name: 'John Smith', email: 'john.smith@email.com', phone: '+1 555-0102', type: 'patient' },
  { id: 3, name: 'Emily Chen', email: 'emily.chen@email.com', phone: '+1 555-0103', type: 'patient' },
  { id: 4, name: 'Robert Johnson', email: 'robert.j@email.com', phone: '+1 555-0104', type: 'patient' },
  { id: 5, name: 'Sarah Williams', email: 'sarah.w@email.com', phone: '+1 555-0105', type: 'patient' },
  { id: 6, name: 'Michael Brown', email: 'michael.brown@email.com', phone: '+1 555-0106', type: 'patient' },
  { id: 7, name: 'Jessica Davis', email: 'jessica.davis@email.com', phone: '+1 555-0107', type: 'patient' },
  { id: 8, name: 'David Wilson', email: 'david.wilson@email.com', phone: '+1 555-0108', type: 'patient' },
];

export function PatientSearch({ className, isMobile = false }: PatientSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate API search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const filteredResults = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.email.toLowerCase().includes(query.toLowerCase()) ||
        patient.phone.includes(query)
      ).slice(0, 6); // Limit to 6 results

      setResults(filteredResults);
      setIsOpen(filteredResults.length > 0);
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSelectPatient(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPatient = (patient: SearchResult) => {
    console.log('Selected patient:', patient);
    setQuery(patient.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    // In real app, navigate to patient page or open patient modal
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  if (isMobile) {
    return (
      <Button variant="ghost" size="icon">
        <Search className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients..."
          className="pl-10 pr-10 bg-muted/50"
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching patients...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 text-xs text-muted-foreground border-b border-border">
                {results.length} patient{results.length !== 1 ? 's' : ''} found
              </div>
              {results.map((patient, index) => (
                <button
                  key={patient.id}
                  className={cn(
                    'w-full text-left p-3 hover:bg-accent transition-colors',
                    'flex items-center gap-3 border-b border-border last:border-0',
                    selectedIndex === index && 'bg-accent'
                  )}
                  onClick={() => handleSelectPatient(patient)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{patient.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{patient.email}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {patient.phone}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No patients found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}