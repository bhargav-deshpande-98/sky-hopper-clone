import { SwingCoptersGame } from "@/components/game/SwingCoptersGame";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--game-sky))' }}>
      <SwingCoptersGame />
    </div>
  );
};

export default Index;
