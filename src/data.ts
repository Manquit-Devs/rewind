import data from '../data/data.json';

type UserJoinChannel = typeof data.individual.entrada_canal_voz_usuario[0];
type UserSendMessageCount = typeof data.individual.msg_usuario[0];
type UserSendMessageCountByChannel = typeof data.individual.msg_usuario_canal[0];
type UserPlayGame = typeof data.individual.gamer_jogo[0];
type UserStreamHours = typeof data.individual.streamer[0];
type UserAfkHours = typeof data.individual.rei_afk[0];
type UserMuttedCount = typeof data.individual.mudinho[0];
type UserMuttedByModCount = typeof data.individual.oprimido[0];
type UserSendMessageByMonth = typeof data.individual.msg_usuario_mes[0];
type UserJoinChannelByMonth = typeof data.individual.entrada_canal_voz_usuario_mes[0];
type UserJoinChannelOffline = typeof data.individual.jogo_offline[0];

export type User = {
  id: string,
  name: string
}

export type UserData = User & Partial<{
  joinChannel: UserJoinChannel[],
  sendMessage: UserSendMessageCountByChannel[],
  playGame: UserPlayGame[],
  stream: UserStreamHours,
  afk: UserAfkHours,
  mutted: UserMuttedCount,
  userMuttedByMod: UserMuttedByModCount,
  monthActivity: number[]
  joinOffline: UserJoinChannelOffline,
}>;

const calculateActivity = (joinChannel: number, messages: number) => (joinChannel * 5 + messages) / 6;

const userSendMessageCountMappedById = data.individual.msg_usuario.reduce((acc, userSendMessage) => {
  acc.set(userSendMessage.ID_USER, userSendMessage);
  return acc
}, new Map<string, UserSendMessageCount>());

const userJoinChannelCountByMonthMappedById = data.individual.entrada_canal_voz_usuario_mes.reduce((acc, userJoinChannel) => {
  const id = userJoinChannel.ID_USER;
  const currValue = acc.get(id);
  acc.set(id, [...currValue ?? [], userJoinChannel]);
  return acc;
}, new Map<string, UserJoinChannelByMonth[]>());

const userSendMessageCountByMonthMappedMappedById = data.individual.msg_usuario_mes.reduce((acc, userSendMessage) => {
  const id = userSendMessage.ID_USER;
  const currValue = acc.get(id);
  acc.set(id, [...currValue ?? [], userSendMessage]);
  return acc;
}, new Map<string, UserSendMessageByMonth[]>());

export const userJoinChannelMappedById = data.individual.entrada_canal_voz_usuario.reduce((acc, userJoinChannel) => {
  const id = userJoinChannel.ID_USER;
  const currValue = acc.get(id);
  acc.set(id, [...currValue ?? [], userJoinChannel]);
  return acc;
}, new Map<string, UserJoinChannel[]>());


const userJoinChannelCountMappedById = data.individual.entrada_canal_voz_usuario.reduce((acc, userJoinChannel) => {
  const id = userJoinChannel.ID_USER;
  const currValue = acc.get(id);
  acc.set(id, { ...userJoinChannel, COUNT: currValue?.COUNT ?? 0 + userJoinChannel.COUNT });
  return acc;
}, new Map<string, UserJoinChannel>());

export const userJoinChannelCountMappedByChannel = data.individual.entrada_canal_voz_usuario.reduce((acc, userJoinChannel) => {
  const channel = userJoinChannel.V_CHANNEL_NAME;
  const currValue = acc.get(channel) ?? 0;
  acc.set(channel, currValue + userJoinChannel.COUNT);
  return acc;
}, new Map<string, number>());

export const userSendMessageMappedByChannel = data.individual.msg_usuario_canal.reduce((acc, userSendMessage) => {
  const channel = userSendMessage.CHANNEL_NAME;
  const currValue = acc.get(channel) ?? 0;
  acc.set(channel, currValue + userSendMessage.COUNT);
  return acc;
}, new Map<string, number>());

const userSendMessageOnChannelCountMappedById = data.individual.msg_usuario_canal.reduce((acc, userSendMessage) => {
  const id = userSendMessage.ID_USER;
  const currValue = acc.get(id);
  acc.set(id, [...currValue ?? [], userSendMessage]);
  return acc;
}, new Map<string, UserSendMessageCountByChannel[]>);

export const userPlayGameMappedByGame = data.individual.gamer_jogo.reduce((acc, userPlayGame) => {
  const game = userPlayGame.DS_EVENT;
  const currValue = acc.get(game) ?? 0;
  acc.set(game, currValue + userPlayGame.COUNT);
  return acc;
}, new Map<string, number>());

export const userPlayGameMappedById = data.individual.gamer_jogo.reduce((acc, userPlayGame) => {
  const id = userPlayGame.ID_USER;
  const currValue = acc.get(id);
  acc.set(id, [...currValue ?? [], userPlayGame]);
  return acc;
}, new Map<string, UserPlayGame[]>());

export const userStreamHoursMappedById = data.individual.streamer.reduce((acc, userStream) => {
  acc.set(userStream.ID_USER, userStream);
  return acc;
}, new Map<string, UserStreamHours>);

export const userAfkMappedById = data.individual.rei_afk.reduce((acc, userAfk) => {
  acc.set(userAfk.ID_USER, userAfk);
  return acc;
}, new Map<string, UserAfkHours>());

export const userMuttedMappedById = data.individual.mudinho.reduce((acc, userMutted) => {
  acc.set(userMutted.ID_USER, userMutted);
  return acc;
}, new Map<string, UserMuttedCount>());

export const userMuttedByModMappedById = data.individual.oprimido.reduce((acc, userMuttedByMod) => {
  acc.set(userMuttedByMod.ID_USER, userMuttedByMod);
  return acc;
}, new Map<string, UserMuttedByModCount>());

export const usersSortedByActivity = Array.from(userJoinChannelCountMappedById.values()).map(userJoinChannel => {
  return {
    id: userJoinChannel.ID_USER,
    name: userJoinChannel.USER_NAME,
    activityValue: calculateActivity(userJoinChannel.COUNT, userSendMessageCountMappedById.get(userJoinChannel.ID_USER)?.COUNT ?? 0),
  }
}).sort((a, b) => b.activityValue - a.activityValue);

const userActivityByMonth = usersSortedByActivity.reduce((acc, user) => {
  const userMessagesByMonth = userSendMessageCountByMonthMappedMappedById.get(user.id);
  const userJoinChannelByMonth = userJoinChannelCountByMonthMappedById.get(user.id);

  const monthsActivity = [...Array(12)].map((_, i) => i + 1).map((month) => {
    const messages = userMessagesByMonth?.find(userMessage => userMessage.MONTH === month)?.COUNT ?? 0;
    const joinChannelCount = userJoinChannelByMonth?.find(userJoinChannel => userJoinChannel.MONTH === month)?.COUNT ?? 0;
    return calculateActivity(joinChannelCount, messages);
  });

  acc.set(user.id, monthsActivity);
  return acc;
}, new Map<string, number[]>);

export const ServerTotalActivityByMonths = [...Array(12).keys()].map((i) => Array.from((userActivityByMonth.values())).reduce((acc, monthActivity) => acc + monthActivity[i], 0));

export const userPlayGameCountById = usersSortedByActivity.reduce((acc, user) => {
  const userGamesCount = Array.from(userPlayGameMappedById.get(user.id)?.values() ?? []).reduce((acc, userPlayGame) => acc + userPlayGame.COUNT, 0);
  acc.set(user.id, { ...user, count: userGamesCount });
  return acc;
}, new Map<string, User & { count: number }>);

export const userJoinChannelOfflineMappedById = data.individual.jogo_offline.reduce((acc, joinOffline) => {
  acc.set(joinOffline.ID_USER, joinOffline);
  return acc
}, new Map<string, UserJoinChannelOffline>);

export const userChangeName = data.individual.crise_ideologica;

export const usersDataMappedById = usersSortedByActivity.reduce((acc, user) => {
  acc.set(user.id, {
    id: user.id,
    name: user.name,
    joinChannel: userJoinChannelMappedById.get(user.id)?.sort((a, b) => b.COUNT - a.COUNT),
    sendMessage: userSendMessageOnChannelCountMappedById.get(user.id)?.sort((a, b) => b.COUNT - a.COUNT),
    playGame: userPlayGameMappedById.get(user.id)?.sort((a, b) => b.COUNT - a.COUNT),
    stream: userStreamHoursMappedById.get(user.id),
    afk: userAfkMappedById.get(user.id),
    mutted: userMuttedMappedById.get(user.id),
    userMuttedByMod: userMuttedByModMappedById.get(user.id),
    monthActivity: userActivityByMonth.get(user.id),
    joinOffline: userJoinChannelOfflineMappedById.get(user.id),
  });

  return acc;
}, new Map<string, UserData>());

