import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOnline } from '@/hooks/use-online';

const OnlineIndicator = () => {
  const isOnline = useOnline();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative flex items-center justify-center">
          <span className={`block h-2.5 w-2.5 rounded-full transition-colors ${
            isOnline ? 'bg-green-500' : 'bg-destructive'
          }`} />
          {isOnline && (
            <span className="absolute h-2.5 w-2.5 rounded-full bg-green-500 animate-ping opacity-50" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">{isOnline ? 'Online' : 'Offline'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default OnlineIndicator;
