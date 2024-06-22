import React, { useState, useRef, ChangeEvent } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, Upload } from 'lucide-react';

interface MaxSupplyOption {
  value: string;
  label: string;
}

const ImageUpload: React.FC<{ onImageUpload: (file: File) => void }> = ({ onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.substr(0, 5) === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <Label htmlFor="tokenIcon" className="text-gray-700">Token Icon</Label>
      <div className="mt-2 flex items-center space-x-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500 bg-gray-50"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Token icon preview" className="w-full h-full object-cover rounded-full" />
          ) : (
            <Upload className="text-gray-400" />
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
      </div>
    </div>
  );
};

const ERC20TokenCreator: React.FC = () => {
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [maxSupplyOption, setMaxSupplyOption] = useState<string>('1000000');
  const [customMaxSupply, setCustomMaxSupply] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [deployedAddress, setDeployedAddress] = useState<string>('');
  const [tokenIcon, setTokenIcon] = useState<File | null>(null);

  const maxSupplyOptions: MaxSupplyOption[] = [
    { value: '1000000', label: '1,000,000' },
    { value: '10000000', label: '10,000,000' },
    { value: '100000000', label: '100,000,000' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleDeploy = async (): Promise<void> => {
    const maxSupply = maxSupplyOption === 'custom' ? customMaxSupply : maxSupplyOption;
    if (!tokenName || !tokenSymbol || !maxSupply || !selectedChain) {
      alert('Please fill in all fields.');
      return;
    }

    // ここでデプロイのロジックを実装します（実際の実装は環境に依存します）
    setDeployedAddress('0x1234567890123456789012345678901234567890');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-700 to-teal-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">ERC20 Token Creator</h1>
        
        <ImageUpload onImageUpload={setTokenIcon} />

        <div className="mb-4">
          <Label htmlFor="tokenName" className="text-gray-700">Token Name</Label>
          <Input
            id="tokenName"
            value={tokenName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTokenName(e.target.value)}
            className="bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="tokenSymbol" className="text-gray-700">Token Symbol</Label>
          <Input
            id="tokenSymbol"
            value={tokenSymbol}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTokenSymbol(e.target.value)}
            className="bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <Label className="text-gray-700">Max Supply</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {maxSupplyOptions.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all ${maxSupplyOption === option.value ? 'border-blue-500 border-2' : ''}`}
                onClick={() => setMaxSupplyOption(option.value)}
              >
                <CardContent className="flex items-center justify-between p-4 h-full">
                  <span className="flex-grow text-center text-gray-700">{option.label}</span>
                  {maxSupplyOption === option.value && <Check className="text-blue-500 ml-2 flex-shrink-0" />}
                </CardContent>
              </Card>
            ))}
          </div>
          {maxSupplyOption === 'custom' && (
            <Input
              type="number"
              value={customMaxSupply}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomMaxSupply(e.target.value)}
              placeholder="Enter custom max supply"
              className="mt-2 bg-gray-50"
            />
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="chain" className="text-gray-700">Select Chain</Label>
          <select
            id="chain"
            value={selectedChain}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedChain(e.target.value)}
            className="w-full p-2 bg-gray-50 text-gray-700 rounded-md border border-gray-300"
          >
            <option value="">Select a chain</option>
            <option value="ethereum">Ethereum</option>
            <option value="binance">Binance Smart Chain</option>
            <option value="polygon">Polygon</option>
          </select>
        </div>

        <button
          onClick={handleDeploy}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all"
        >
          Deploy Token
        </button>

        {deployedAddress && (
          <Alert className="mt-4 bg-green-100 text-green-800 border border-green-300">
            <AlertDescription>
              Token deployed at: {deployedAddress}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ERC20TokenCreator;