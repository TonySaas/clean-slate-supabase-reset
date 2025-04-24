
import { Input } from '@/components/ui/input';

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export const PasswordFields = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange
}: PasswordFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input 
          id="password" 
          type="password" 
          required 
          value={password} 
          onChange={e => onPasswordChange(e.target.value)} 
          placeholder="Enter your password" 
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <Input 
          id="confirmPassword" 
          type="password" 
          required 
          value={confirmPassword} 
          onChange={e => onConfirmPasswordChange(e.target.value)} 
          placeholder="Confirm your password" 
        />
      </div>
    </>
  );
};
