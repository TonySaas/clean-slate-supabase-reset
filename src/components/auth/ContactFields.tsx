
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface ContactFieldsProps {
  email: string;
  phone: string;
  jobTitle: string;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onJobTitleChange: (value: string) => void;
  emailError?: string | null;
}

export const ContactFields = ({
  email,
  phone,
  jobTitle,
  onEmailChange,
  onPhoneChange,
  onJobTitleChange,
  emailError
}: ContactFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <Input 
          id="email" 
          type="email" 
          required 
          value={email} 
          onChange={e => onEmailChange(e.target.value)} 
          placeholder="Enter your email" 
          className={emailError ? "border-red-300" : ""}
        />
        {emailError && (
          <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{emailError}</span>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <Input 
          id="phone" 
          type="tel" 
          value={phone} 
          onChange={e => onPhoneChange(e.target.value)} 
          placeholder="Enter your phone number" 
        />
      </div>
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <Input 
          id="jobTitle" 
          type="text" 
          value={jobTitle} 
          onChange={e => onJobTitleChange(e.target.value)} 
          placeholder="Enter your job title" 
        />
      </div>
    </>
  );
};
