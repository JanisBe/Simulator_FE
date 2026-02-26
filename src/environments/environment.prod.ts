export const environment = {
    stompWebSocketBaseurl: 'http://localhost:8080/ws',
    providerWebSocketTopic: '/user/topic/fixMessages',
    distributorWebSocketTopic: '/user/topic/fixMessages',
    distributorSendWebSocketTopic: '/app/sendFixMessages',
    startStopInitiatorTopic: '/user/topic/startStopDistributor',
    startStopInitiatorSendTopic: '/app/startStopDistributor',
    startStopProviderTopic: '/user/topic/startStopProvider',
    startStopProviderSendTopic: '/app/startStopProvider',
    progressWebSocketTopic: '/user/topic/progress',
    errorsTopic: '/user/queue/errors',
    stopEngineBulkMessagesTopic: '/app/stopSendingBulkMessages',
};