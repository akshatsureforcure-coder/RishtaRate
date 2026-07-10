import Icon from "../Icon";

interface ComingSoonScreenProps {
  icon: string;
  title: string;
  body: string;
}

export default function ComingSoonScreen({ icon, title, body }: ComingSoonScreenProps) {
  return (
    <main className="pt-[128px] pb-32 px-[20px] flex flex-col items-center justify-center text-center min-h-screen max-w-lg mx-auto w-full">
      <div className="w-20 h-20 rounded-full bg-secondary-container/30 flex items-center justify-center mb-6">
        <Icon name={icon} className="text-primary" style={{ fontSize: 36 }} />
      </div>
      <h2 className="font-headline-md text-on-surface mb-2">{title}</h2>
      <p className="font-body-md text-on-surface-variant max-w-xs">{body}</p>
    </main>
  );
}
