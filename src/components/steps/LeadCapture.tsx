import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'; 
import { UserData } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Rocket, Phone, Heart, Baby, ArrowRight, Calendar } from 'lucide-react';

interface LeadCaptureProps {
  data: UserData;
  onNext: (data: Partial<UserData>) => void;
  step: 1 | 2;
}

export function LeadCapture({ data, onNext, step }: LeadCaptureProps) {
  const [phone, setPhone] = React.useState(data.phone);
  const [maritalStatus, setMaritalStatus] = React.useState<UserData['maritalStatus']>(data.maritalStatus);
  const [spouseName, setSpouseName] = React.useState(data.spouseName || '');
  const [spouseDob, setSpouseDob] = React.useState(data.spouseDob || '');
  const [children, setChildren] = React.useState(data.children);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const addChild = () => {
    setChildren([...children, { name: '', age: 0 }]);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: 'name' | 'age', value: string | number) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildren(newChildren);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (step === 1) {
      if (!phone) newErrors.phone = 'Phone number is required';
      else if (!/^\+?[\d\s-]{10,}$/.test(phone)) newErrors.phone = 'Invalid phone number';
    } else {
      if (maritalStatus === 'Married') {
        if (!spouseName) newErrors.spouseName = 'Spouse name is required';
        if (!spouseDob) newErrors.spouseDob = 'Spouse Date of Birth is required';
      }
      children.forEach((child, idx) => {
        if (!child.name) newErrors[`child_name_${idx}`] = 'Child name is required';
        if (child.age < 0) newErrors[`child_age_${idx}`] = 'Invalid age';
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (step === 1) {
        onNext({ phone });
      } else {
        onNext({ maritalStatus, spouseName, spouseDob, children });
      }
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight">Almost There!</h2>
          <p className="text-lg text-muted-foreground font-medium">Please provide your contact details to receive the full report.</p>
        </div>

        <Card className="border-none shadow-premium bg-card overflow-hidden">
          <CardHeader className="border-b border-border bg-slate-50/50 p-6">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">WhatsApp Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className={cn("pl-12 h-12 rounded-xl border-border focus:ring-secondary", errors.phone && "border-destructive")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {errors.phone && <p className="text-xs font-bold text-destructive">{errors.phone}</p>}
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl btn-gradient-blue text-white font-black shadow-xl shadow-secondary/20 hover-scale border-none text-lg">
                Continue to Family Details <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight">Family Details</h2>
        <p className="text-lg text-muted-foreground font-medium">This helps us tailor your retirement and child education plans.</p>
      </div>

      <Card className="border-none shadow-premium bg-card overflow-hidden">
        <CardHeader className="border-b border-border bg-slate-50/50 p-6">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Family Information</CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Marital Status</Label>
              <RadioGroup value={maritalStatus} onValueChange={(v: any) => setMaritalStatus(v)} className="flex gap-8">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Single" id="single" className="border-slate-300 text-secondary" />
                  <Label htmlFor="single" className="text-sm font-bold">Single</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Married" id="married" className="border-slate-300 text-secondary" />
                  <Label htmlFor="married" className="text-sm font-bold">Married</Label>
                </div>
              </RadioGroup>
            </div>

            {maritalStatus === 'Married' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="spouse" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Spouse Name</Label>
                    <div className="relative">
                      <Heart className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="spouse"
                        placeholder="Enter spouse name"
                        className={cn("pl-12 h-12 rounded-xl border-border", errors.spouseName && "border-destructive")}
                        value={spouseName}
                        onChange={(e) => setSpouseName(e.target.value)}
                      />
                    </div>
                    {errors.spouseName && <p className="text-xs font-bold text-destructive">{errors.spouseName}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="spouseDob" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Spouse Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="spouseDob"
                        type="date"
                        className={cn("pl-12 h-12 rounded-xl border-border", errors.spouseDob && "border-destructive")}
                        value={spouseDob}
                        onChange={(e) => setSpouseDob(e.target.value)}
                      />
                    </div>
                    {errors.spouseDob && <p className="text-xs font-bold text-destructive">{errors.spouseDob}</p>}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Children</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addChild} className="text-secondary hover:text-secondary/80 h-10 font-black rounded-xl hover:bg-secondary/5">
                      <Plus className="h-4 w-4 mr-2" /> Add Child
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {children.map((child, idx) => (
                      <div key={idx} className="flex gap-4 items-end p-6 rounded-2xl bg-slate-50 border border-slate-100 hover-scale">
                        <div className="flex-1 space-y-2">
                          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Name</Label>
                          <div className="relative">
                            <Baby className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Name"
                              className={cn("pl-11 h-11 rounded-xl border-border bg-white", errors[`child_name_${idx}`] && "border-destructive")}
                              value={child.name}
                              onChange={(e) => updateChild(idx, 'name', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="w-24 space-y-2">
                          <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Age</Label>
                          <Input
                            type="number"
                            placeholder="Age"
                            className={cn("h-11 rounded-xl border-border bg-white", errors[`child_age_${idx}`] && "border-destructive")}
                            value={child.age || ''}
                            onChange={(e) => updateChild(idx, 'age', Number(e.target.value))}
                          />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeChild(idx)} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-11 w-11 rounded-xl">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-14 rounded-2xl btn-gradient-blue text-white font-black shadow-xl shadow-secondary/20 hover-scale border-none text-lg">
              Complete Profile & Get Report <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

