import data from '../data/data.json';

type UserJoinChannel = typeof data.individual.entrada_canal_voz_usuario[0];
type UserSendMessage = typeof data.individual.msg_usuario[0];

const getMostActiveUsers = () => {
  const userJoinChannelById = new Map<string, UserJoinChannel>();

  for (const userJoinChannel of data.individual.entrada_canal_voz_usuario) {
    const id = userJoinChannel.ID_USER;
    const currValue = userJoinChannelById.get(id);
    userJoinChannelById.set(id, { ...userJoinChannel, COUNT: currValue?.COUNT ?? 0 + userJoinChannel.COUNT });
  }

  const userSendMessageById = new Map<string, UserSendMessage>();

  for (const userSendMessage of data.individual.msg_usuario) {
    userSendMessageById.set(userSendMessage.ID_USER, userSendMessage);
  }

  return Array.from(userJoinChannelById.values()).map(userJoinChannel => {
    const value = (userJoinChannel.COUNT * 5 + (userSendMessageById.get(userJoinChannel.ID_USER)?.COUNT ?? 0)) / 6;

    return {
      id: userJoinChannel.ID_USER,
      name: userJoinChannel.USER_NAME,
      value
    }
  }).sort((a, b) => b.value - a.value);
}

export const mostActiveUsers = getMostActiveUsers();

const top10MostActiveWithPercentage = () => {
  const top10 = mostActiveUsers.slice(0, 10);
  const total = top10.reduce((acc, user) => acc + user.value, 0);
  return top10.map(user => ({ ...user, percentage: 100 * user.value / total }));
};
