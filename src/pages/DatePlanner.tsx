import { useState } from 'react';
import { motion } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';

interface DatePlan {
  id: string;
  date: string;
  time: string;
  activity: string;
  location: string;
  notes: string;
}

const DatePlanner = () => {
  const [plans, setPlans] = useState<DatePlan[]>(() => {
    const saved = localStorage.getItem('datePlans');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPlan, setCurrentPlan] = useState<DatePlan>({
    id: '',
    date: '',
    time: '',
    activity: '',
    location: '',
    notes: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { playSound } = useSound();

  const activitySuggestions = [
    'Romantic Dinner',
    'Movie Night',
    'Picnic in the Park',
    'Stargazing',
    'Coffee Date',
    'Museum Visit',
    'Beach Walk',
    'Cooking Together',
    'Dance Class',
    'Art Gallery',
    'Concert',
    'Hiking',
  ];

  const savePlan = () => {
    if (!currentPlan.date || !currentPlan.activity) {
      playSound('buttonClick');
      return;
    }

    const plan: DatePlan = {
      ...currentPlan,
      id: currentPlan.id || Date.now().toString(),
    };

    const updated = isEditing
      ? plans.map((p) => (p.id === plan.id ? plan : p))
      : [...plans, plan].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setPlans(updated);
    localStorage.setItem('datePlans', JSON.stringify(updated));
    setCurrentPlan({ id: '', date: '', time: '', activity: '', location: '', notes: '' });
    setIsEditing(false);
    playSound('success');
  };

  const deletePlan = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    localStorage.setItem('datePlans', JSON.stringify(updated));
    playSound('buttonClick');
  };

  const editPlan = (plan: DatePlan) => {
    setCurrentPlan(plan);
    setIsEditing(true);
    playSound('buttonClick');
  };

  const upcomingPlans = plans.filter((p) => new Date(p.date) >= new Date());
  const pastPlans = plans.filter((p) => new Date(p.date) < new Date());

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={10} />
      
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
            Virtual Date Planner
          </h1>
          <p className="text-muted-foreground font-serif-italic">
            Plan your perfect dates together
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-elevated mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-medium mb-4">Plan a Date</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              value={currentPlan.date}
              onChange={(e) => setCurrentPlan({ ...currentPlan, date: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
            />
            <input
              type="time"
              value={currentPlan.time}
              onChange={(e) => setCurrentPlan({ ...currentPlan, time: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Activity Suggestions:</label>
            <div className="flex flex-wrap gap-2">
              {activitySuggestions.map((activity) => (
                <button
                  key={activity}
                  onClick={() => setCurrentPlan({ ...currentPlan, activity })}
                  className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Activity..."
            value={currentPlan.activity}
            onChange={(e) => setCurrentPlan({ ...currentPlan, activity: e.target.value })}
            className="w-full px-4 py-2 mb-4 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
          />

          <input
            type="text"
            placeholder="Location..."
            value={currentPlan.location}
            onChange={(e) => setCurrentPlan({ ...currentPlan, location: e.target.value })}
            className="w-full px-4 py-2 mb-4 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
          />

          <textarea
            placeholder="Notes..."
            value={currentPlan.notes}
            onChange={(e) => setCurrentPlan({ ...currentPlan, notes: e.target.value })}
            className="w-full h-24 px-4 py-2 mb-4 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none resize-none"
          />

          <div className="flex gap-2">
            <button onClick={savePlan} className="flex-1 btn-romantic py-2">
              {isEditing ? 'Update' : 'Save'} Plan
            </button>
            {isEditing && (
              <button
                onClick={() => {
                  setCurrentPlan({ id: '', date: '', time: '', activity: '', location: '', notes: '' });
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.div>

        {/* Plans List */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-medium mb-4">Upcoming Dates</h2>
            <div className="space-y-3">
              {upcomingPlans.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No upcoming dates</p>
              ) : (
                upcomingPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-elevated"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{plan.activity}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(plan.date).toLocaleDateString()} {plan.time && `at ${plan.time}`}
                        </p>
                        {plan.location && (
                          <p className="text-sm text-muted-foreground">📍 {plan.location}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editPlan(plan)} className="text-primary">Edit</button>
                        <button onClick={() => deletePlan(plan.id)} className="text-red-500">Delete</button>
                      </div>
                    </div>
                    {plan.notes && <p className="text-sm text-muted-foreground">{plan.notes}</p>}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Past */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-medium mb-4">Past Dates</h2>
            <div className="space-y-3">
              {pastPlans.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No past dates</p>
              ) : (
                pastPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-soft opacity-75"
                  >
                    <h3 className="font-medium">{plan.activity}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(plan.date).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DatePlanner;
