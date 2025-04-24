
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        <Label htmlFor="firstName" className="text-gray-700">
          First Name
        </Label>
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
        <Label htmlFor="lastName" className="text-gray-700">
          Last Name
        </Label>
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
