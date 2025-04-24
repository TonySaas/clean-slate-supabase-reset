
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
        <Label htmlFor="email" className="text-gray-700">
          Email address
        </Label>
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
        <Label htmlFor="phone" className="text-gray-700">
          Phone Number
        </Label>
        <Input 
          id="phone" 
          type="tel" 
          value={phone} 
          onChange={e => onPhoneChange(e.target.value)} 
          placeholder="Enter your phone number" 
        />
      </div>
      <div>
        <Label htmlFor="jobTitle" className="text-gray-700">
          Job Title
        </Label>
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
