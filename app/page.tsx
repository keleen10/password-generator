'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, RefreshCw, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const transformWord = (word: string, charset: string) => {
  // Convert word to array for easier manipulation
  const chars = word.split('');
  
  // Common letter replacements
  const replacements: { [key: string]: string } = {
    'a': '@',
    'e': '3',
    'i': '1',
    'o': '0',
    's': '$',
    't': '7',
    'b': '8',
    'g': '9',
    'l': '!',
  };

  // Transform each character
  let transformed = chars.map((char, index) => {
    // 50% chance to apply letter replacement if available
    if (replacements[char.toLowerCase()] && Math.random() > 0.5) {
      return replacements[char.toLowerCase()];
    }
    
    // 30% chance to uppercase if it's a letter
    if (char.match(/[a-z]/i) && Math.random() > 0.7) {
      return char.toUpperCase();
    }
    
    // 20% chance to insert a random character from charset after this char
    if (Math.random() > 0.8) {
      const randomChar = charset[Math.floor(Math.random() * charset.length)];
      return char + randomChar;
    }
    
    return char;
  });

  // Join and ensure at least one number and symbol is present
  let result = transformed.join('');
  const randomNumber = Math.floor(Math.random() * 10);
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  
  // Insert number and symbol at random positions
  const pos1 = Math.floor(Math.random() * result.length);
  const pos2 = Math.floor(Math.random() * (result.length + 1));
  
  result = result.slice(0, pos1) + randomNumber + result.slice(pos1);
  result = result.slice(0, pos2) + randomSymbol + result.slice(pos2);

  return result;
};

export default function Home() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [suggestedWord, setSuggestedWord] = useState('');

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      toast.error('Please select at least one character type');
      return;
    }

    let newPassword = '';
    
    if (suggestedWord) {
      // Transform the suggested word
      const transformedWord = transformWord(suggestedWord, charset);
      
      // If transformed word is longer than desired length, truncate it
      if (transformedWord.length > length[0]) {
        newPassword = transformedWord.slice(0, length[0]);
      } else {
        // Add random characters to reach desired length
        newPassword = transformedWord;
        while (newPassword.length < length[0]) {
          const randomChar = charset[Math.floor(Math.random() * charset.length)];
          const randomPosition = Math.floor(Math.random() * (newPassword.length + 1));
          newPassword = newPassword.slice(0, randomPosition) + randomChar + newPassword.slice(randomPosition);
        }
      }
    } else {
      // Generate completely random password
      for (let i = 0; i < length[0]; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        newPassword += charset[randomIndex];
      }
    }

    setPassword(newPassword);
    toast.success('Password generated!');
  };

  const copyToClipboard = () => {
    if (!password) {
      toast.error('Generate a password first');
      return;
    }
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <CardTitle>Password Generator</CardTitle>
          </div>
          <CardDescription>Generate secure, random passwords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={password}
              readOnly
              placeholder="Your password will appear here"
              className="w-full p-4 rounded-lg bg-muted text-foreground font-mono text-lg"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={generatePassword}
                className="hover:bg-background/50"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="hover:bg-background/50"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Suggest a Word (optional)</label>
              <Input
                type="text"
                placeholder="Enter a word to include"
                value={suggestedWord}
                onChange={(e) => setSuggestedWord(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password Length: {length}</label>
              <Slider
                value={length}
                onValueChange={setLength}
                min={6}
                max={32}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Include Characters:</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={(checked) => setIncludeUppercase(!!checked)}
                  />
                  <label htmlFor="uppercase" className="text-sm">Uppercase</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={(checked) => setIncludeLowercase(!!checked)}
                  />
                  <label htmlFor="lowercase" className="text-sm">Lowercase</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(!!checked)}
                  />
                  <label htmlFor="numbers" className="text-sm">Numbers</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(!!checked)}
                  />
                  <label htmlFor="symbols" className="text-sm">Symbols</label>
                </div>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={generatePassword}
            >
              Generate Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}