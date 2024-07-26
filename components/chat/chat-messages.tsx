'use client';

import { Member, Message, Profile } from '@prisma/client';
import { format } from 'date-fns';
import { Loader2, ServerCrash } from 'lucide-react';
import { ElementRef, FC, Fragment, useRef } from 'react';

import { ChatItem } from '@/components/chat/chat-item';
import { ChatWelcome } from '@/components/chat/chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useChatSocket } from '@/hooks/use-chat-socket';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

const ChatMessages: FC<ChatMessagesProps> = ({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className="my-4 h-7 w-7 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  console.log(data,'socketData')

  return (
    <div ref={chatRef} className="flex flex-col flex-1 py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="w-6 h-6 my-4 text-zinc-500 animate-spin" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-xs transition text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.filter((item:any) =>{
              return item
            }).map((message: any) => (
              <ChatItem
                key={message?.id}
                id={message?.id}
                currentMember={member}
                member={message?.ud_memberid_f7fb6b}
                content={message?.content}
                fileUrl={message?.fileUrl}
                deleted={message?.deleted}
                timestamp={format(new Date(message?.created_at), DATE_FORMAT)}
                isUpdated={message?.updatedAt !== message?.created_at}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export { ChatMessages };
