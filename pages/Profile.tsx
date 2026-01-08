
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Award, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  CreditCard, 
  Smartphone,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../App';

type PaymentStep = 'plans' | 'upi' | 'processing' | 'success';

const Profile: React.FC = () => {
  const { user, preferences, login } = useApp();
  
  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, email: user.email });
  
  // Subscription States
  const [showSubModal, setShowSubModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('plans');
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string, period: string} | null>(null);
  const [upiId, setUpiId] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSaveProfile = () => {
    login({ name: editForm.name, email: editForm.email });
    setIsEditing(false);
  };

  const handleStartPayment = (plan: any) => {
    setSelectedPlan(plan);
    setPaymentStep('upi');
  };

  const processPayment = async () => {
    if (!upiId.includes('@')) return alert('Please enter a valid UPI ID');
    setPaymentStep('processing');
    await new Promise(r => setTimeout(r, 2000));
    setPaymentStep('success');
  };

  const plans = {
    monthly: [
      { name: 'Basic', price: '199', features: ['3 Bank Accounts', 'Basic Analytics', 'Manual Tracking'] },
      { name: 'Pro', price: '499', features: ['Unlimited Accounts', 'Smart Insights', 'Auto Sync'] },
      { name: 'Ultimate', price: '999', features: ['Multi-user', 'Tax Reports', 'Priority Support'] }
    ],
    yearly: [
      { name: 'Basic', price: '1,999', features: ['3 Bank Accounts', 'Basic Analytics', 'Manual Tracking'] },
      { name: 'Pro', price: '4,999', features: ['Unlimited Accounts', 'Smart Insights', 'Auto Sync'] },
      { name: 'Ultimate', price: '9,999', features: ['Multi-user', 'Tax Reports', 'Priority Support'] }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Profile Card */}
      <div className={`p-10 rounded-[3rem] border shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden ${preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="w-32 h-32 rounded-full bg-indigo-100 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 group relative">
          <UserIcon className="w-16 h-16" />
          <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
            <Edit3 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          {isEditing ? (
            <div className="space-y-3 max-w-sm mx-auto md:mx-0">
              <input 
                value={editForm.name} 
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full text-2xl font-extrabold bg-slate-50 border-b-2 border-indigo-600 outline-none px-2 py-1"
                placeholder="Your Name"
              />
              <input 
                value={editForm.email} 
                onChange={e => setEditForm({...editForm, email: e.target.value})}
                className="w-full text-slate-500 bg-slate-50 border-b border-slate-300 outline-none px-2 py-1"
                placeholder="Email Address"
              />
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveProfile} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save
                </button>
                <button onClick={() => setIsEditing(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center md:justify-start gap-3">
                 <h2 className="text-3xl font-extrabold">{user.name}</h2>
                 <Award className="w-6 h-6 text-indigo-500" />
                 <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit3 className="w-4 h-4" />
                 </button>
              </div>
              <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Premium Member</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider">ID Verified</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Security Section */}
        <div className={`p-8 rounded-[2.5rem] border shadow-sm ${preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" /> Account Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-sm font-bold block">Two-Factor Auth</span>
                <span className="text-[10px] text-slate-400">Extra layer of protection</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-sm font-bold block">Login History</span>
                <span className="text-[10px] text-slate-400">Last login: Today 10:45 AM</span>
              </div>
              <button className="p-2 hover:bg-white rounded-lg text-indigo-600 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <button className="w-full py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all">
              Change Security PIN
            </button>
          </div>
        </div>

        {/* Membership Section */}
        <div className={`p-8 rounded-[2.5rem] border shadow-sm ${preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" /> Membership Status
          </h3>
          <div className="bg-indigo-600 p-6 rounded-3xl text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Award className="w-20 h-20" />
             </div>
             <p className="text-[10px] text-indigo-100 font-bold uppercase mb-1 tracking-widest">Current Plan</p>
             <h4 className="text-2xl font-bold mb-4">Ultimate Family</h4>
             <p className="text-sm opacity-90 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Renews on Oct 12, 2024
             </p>
             <button 
                onClick={() => {
                  setPaymentStep('plans');
                  setShowSubModal(true);
                }}
                className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20"
             >
                Manage Subscription
             </button>
          </div>
        </div>
      </div>

      {/* Subscription & Payment Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-8 border-b">
              <div className="flex items-center gap-4">
                {paymentStep !== 'plans' && paymentStep !== 'success' && (
                  <button onClick={() => setPaymentStep('plans')} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h3 className="text-2xl font-bold">Subscription Center</h3>
                  <p className="text-sm text-slate-500">Choose a plan that fits your financial journey.</p>
                </div>
              </div>
              <button onClick={() => setShowSubModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {paymentStep === 'plans' && (
                <div className="space-y-8">
                  <div className="flex justify-center">
                    <div className="bg-slate-100 p-1 rounded-2xl flex items-center">
                      <button 
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                      >
                        Monthly
                      </button>
                      <button 
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                      >
                        Yearly <span className="text-[10px] text-emerald-600 ml-1">Save 20%</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {plans[billingCycle].map((plan) => (
                      <div key={plan.name} className={`relative p-8 rounded-[2rem] border-2 transition-all group ${plan.name === 'Pro' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-indigo-200'}`}>
                        {plan.name === 'Pro' && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Popular</span>
                        )}
                        <h4 className="text-xl font-bold mb-1">{plan.name}</h4>
                        <div className="flex items-baseline gap-1 mb-6">
                          <span className="text-3xl font-bold">₹{plan.price}</span>
                          <span className="text-slate-500 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                          {plan.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => handleStartPayment({...plan, period: billingCycle})}
                          className={`w-full py-3 rounded-xl font-bold transition-all ${plan.name === 'Pro' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600'}`}
                        >
                          Select Plan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paymentStep === 'upi' && selectedPlan && (
                <div className="max-w-md mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-indigo-50 p-6 rounded-3xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Total Due</p>
                      <h4 className="text-2xl font-bold">₹{selectedPlan.price}</h4>
                      <p className="text-xs text-indigo-400">{selectedPlan.name} Plan • {selectedPlan.period}</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                       <CreditCard className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Link UPI ID to Pay</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="username@bank / mobile@upi"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-900 outline-none"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 px-1">We support Google Pay, PhonePe, Paytm and all BHIM UPI apps.</p>
                  </div>

                  <button 
                    onClick={processPayment}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    Pay Securely ₹{selectedPlan.price} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <h4 className="text-xl font-bold">Verifying Payment</h4>
                  <p className="text-slate-500">Please do not close this window...</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-20 flex flex-col items-center justify-center text-center animate-in zoom-in-90 duration-500">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h4 className="text-3xl font-bold mb-2">Upgrade Successful!</h4>
                  <p className="text-slate-500 max-w-xs mx-auto mb-10">You are now on the {selectedPlan?.name} plan. All premium features are now active.</p>
                  <button 
                    onClick={() => setShowSubModal(false)}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Go back to Profile
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 text-center border-t">
              <p className="text-xs text-slate-400">By subscribing you agree to our Terms of Service. Manage at any time from Settings.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
