// Script to download user avatars
// Is better download the avatar so if the user delete its account the data is never lost
import DISCORD_SERVER_DATA from '../data/data.json';

const DISCORD_TOKEN = Bun.env.DISCORD_TOKEN;
const AVATARS_FOLDER = '../public/avatars';
const DISCORD_USER_API_URL = 'https://discord.com/api/v10/users';
const DISCORD_AVATAR_URL = 'https://cdn.discordapp.com/avatars';
const DEFAULT_DISCORD_AVATAR_URL = 'https://ia903204.us.archive.org/4/items/discordprofilepictures/discordblue.png';

const userIds = new Set<string>();
let downloadCounter = 0;

for(const data of DISCORD_SERVER_DATA.geral.fluxo_usuarios){
  userIds.add(data.ID_USER);
}

for (const dataArr of Object.values(DISCORD_SERVER_DATA.individual)){
  for (const data of dataArr as {ID_USER?: string}[]){
    const id = data.ID_USER;
    if(id){
      userIds.add(id);
    }
  }
}

for(const userId of userIds) {
  const avatarFilePath = `${AVATARS_FOLDER}/${userId}.png`;
  const avatarFile = Bun.file(avatarFilePath);
  const avatarAlreadyExists = await avatarFile.exists();

  if(!avatarAlreadyExists){
    const response = await fetch(`${DISCORD_USER_API_URL}/${userId}`, {
      headers: {
        "Authorization": `Bot ${DISCORD_TOKEN}`
      }
    });


    if(response.ok){
      const discordUser = await response.json() as {avatar?: string, username: string;};
      const avatarHash = discordUser.avatar;
      const avatarUrl = avatarHash ? `${DISCORD_AVATAR_URL}/${userId}/${avatarHash}` : DEFAULT_DISCORD_AVATAR_URL;
      const downloadedAvatarFile = await fetch(avatarUrl);
      await Bun.write(avatarFilePath, await downloadedAvatarFile.blob());
      downloadCounter++;
      console.log(`Avatar from user ${userId}-${discordUser.username} saved on ${avatarFilePath}`);
      continue;
    }

    console.log(`Failed to download avatar from user ${userId}`);
  }
}

console.log(`${userIds.size} ids detected, ${downloadCounter} avatars downloaded`);

