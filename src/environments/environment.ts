export const environment = {
  stompWebSocketBaseurl: 'http://localhost:8080/ws',
  providerWebSocketTopic: '/user/topic/fixMessages',
  distributorWebSocketTopic: '/user/topic/fixMessages',
  distributorSendWebSocketTopic: '/app/sendFixMessages',
  progressWebSocketTopic: '/user/topic/progress',
  startStopInitiatorTopic: '/user/topic/startStopDistributor',
  startStopInitiatorSendTopic: '/app/startStopDistributor',
  startStopProviderTopic: '/user/topic/startStopProvider',
  startStopProviderSendTopic: '/app/startStopProvider',
  stopEngineBulkMessagesTopic: '/app/stopSendingBulkMessages',
  errorsTopic: '/user/queue/errors',
};
