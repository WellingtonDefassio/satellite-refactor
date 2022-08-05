import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const gateway = await prisma.satelliteServices.upsert({
    where: { name: 'ORBCOMM_V2' },
    create: { name: 'ORBCOMM_V2' },
    update: {},
  });

  const device = await prisma.devices.upsert({
    where: { deviceId: '01719706SKY8A3F' },
    create: {
      deviceId: '01719706SKY8A3F',
      satelliteServiceName: 'ORBCOMM_V2',
      status: 'ACTIVE',
    },
    update: {},
  });

  const sendAttributes = await prisma.satelliteSendedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'fwrdId',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'fwrdId', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });
  const sendAttributes2 = await prisma.satelliteSendedSpecificAttributes.upsert(
    {
      where: {
        attribute_satelliteServiceName: {
          attribute: 'status',
          satelliteServiceName: 'ORBCOMM_V2',
        },
      },
      create: { attribute: 'status', satelliteServiceName: 'ORBCOMM_V2' },
      update: {},
    },
  );

  await prisma.satelliteEmittedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'messageId',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'messageId', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });

  await prisma.satelliteEmittedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'receiveUTC',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'receiveUTC', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });
  await prisma.satelliteEmittedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'SIN',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'SIN', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });
  await prisma.satelliteEmittedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'MIN',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'MIN', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });
  await prisma.satelliteEmittedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'regionName',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'regionName', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });
  await prisma.satelliteEmittedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'costumerId',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'costumerId', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });
  await prisma.satelliteEmittedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'transport',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'transport', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });
  await prisma.satelliteEmittedSpecificAttributes.upsert({
    where: {
      attribute_satelliteServiceName: {
        attribute: 'mobileOwnerId',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    },
    create: { attribute: 'mobileOwnerId', satelliteServiceName: 'ORBCOMM_V2' },
    update: {},
  });

  console.log('EXECUTING SEED PRISMA =>');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
