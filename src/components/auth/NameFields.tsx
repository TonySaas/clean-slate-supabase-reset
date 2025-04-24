
import { Input } from '@/components/ui/input';

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export const NameFields = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange
}: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <Input 
          id="firstName" 
          type="text" 
          required 
          value={firstName} 
          onChange={e => onFirstNameChange(e.target.value)} 
          placeholder="Enter your first name" 
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <Input 
          id="lastName" 
          type="text" 
          required 
          value={lastName} 
          onChange={e => onLastNameChange(e.target.value)} 
          placeholder="Enter your last name" 
        />
      </div>
    </div>
  );
};
