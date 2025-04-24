
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { NameFields } from './NameFields';
import { ContactFields } from './ContactFields';
import { PasswordFields } from './PasswordFields';
import { AlertCircle } from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    jobTitle: string;
  }) => void;
  isSubmitting: boolean;
}

export const RegistrationForm = ({ onSubmit, isSubmitting }: RegistrationFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    // Clear password error when either password field changes
    if (passwordError) setPasswordError(null);
  }, [password, confirmPassword]);

  const validatePasswords = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    onSubmit({
      email,
      password,
      firstName,
      lastName,
      phone,
      jobTitle
    });
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <NameFields
          firstName={firstName}
          lastName={lastName}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
        />
        
        <ContactFields
          email={email}
          phone={phone}
          jobTitle={jobTitle}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onJobTitleChange={setJobTitle}
        />
        
        <PasswordFields
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
        />
        
        {passwordError && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{passwordError}</span>
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};
