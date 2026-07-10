import Icon from "./Icon";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface flex justify-between items-center px-[20px] py-[16px]">
      <div className="flex items-center gap-2">
        <Icon name="local_florist" className="text-primary text-2xl" />
        <h1 className="font-headline-md text-primary font-bold">Rishta Rate</h1>
      </div>
      <button
        type="button"
        aria-label="Account"
        className="transition-transform duration-200 active:scale-95 text-on-surface-variant hover:bg-primary-container/10 p-2 rounded-full"
      >
        <Icon name="account_circle" className="text-2xl" />
      </button>
    </header>
  );
}
