import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserData } from '@/types';
import { User, Calendar, IndianRupee, ArrowRight } from 'lucide-react';

interface AllocationInputProps {
  onNext: (data: Partial<UserData>) => void;
  initialData: UserData;
}

export function AllocationInput({ onNext, initialData }: AllocationInputProps) {
  const [name, setName] = React.useState(initialData.name);
  const [age, setAge] = React.useState(initialData.age);
  const [income, setIncome] = React.useState(initialData.annualIncome);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ name, age: Number(age), annualIncome: Number(income) });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-foreground">Personal Details</h2>
        <p className="text-muted-foreground font-medium">Let's start with the basics to build your profile.</p>
      </div>

      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="border-b border-border bg-slate-50/50">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="pl-10 h-11 rounded-xl border-border focus:ring-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Age</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g. 30"
                    className="pl-10 h-11 rounded-xl border-border focus:ring-primary"
                    value={age || ''}
                    onChange={(e) => setAge(Number(e.target.value))}
                    required
                    min={18}
                    max={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="income" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Annual Income (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g. 1200000"
                    className="pl-10 h-11 rounded-xl border-border focus:ring-primary"
                    value={income || ''}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 border-none">
              Generate Allocation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

