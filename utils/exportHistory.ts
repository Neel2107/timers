import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { TimerHistoryItem } from '@/context/TimerContext';

export const exportHistoryToJSON = async (history: TimerHistoryItem[]) => {
  try {
    const historyData = {
      exportDate: new Date().toISOString(),
      items: history
    };

    const fileUri = `${FileSystem.documentDirectory}timer_history.json`;
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(historyData, null, 2),
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Export Timer History',
      UTI: 'public.json'
    });

    return true;
  } catch (error) {
    console.error('Error exporting history:', error);
    return false;
  }
};