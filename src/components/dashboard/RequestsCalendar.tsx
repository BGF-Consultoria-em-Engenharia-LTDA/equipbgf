
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EquipmentRequest } from '@/types';
import { addDays, isSameDay, isWithinInterval } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/context/InventoryContext';
import { Badge } from '@/components/ui/badge';

interface RequestsCalendarProps {
  requests: EquipmentRequest[];
}

export const RequestsCalendar: React.FC<RequestsCalendarProps> = ({ 
  requests 
}) => {
  const navigate = useNavigate();
  const { equipment } = useInventory();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedDateRequests, setSelectedDateRequests] = React.useState<EquipmentRequest[]>([]);

  // Update selected date requests when date changes
  React.useEffect(() => {
    if (!selectedDate) return;
    
    const filteredRequests = requests.filter(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      
      return isWithinInterval(selectedDate, { start, end }) ||
             isSameDay(selectedDate, start) || 
             isSameDay(selectedDate, end);
    });
    
    setSelectedDateRequests(filteredRequests);
  }, [selectedDate, requests]);

  // Custom day rendering for the calendar
  const renderDay = (day: Date) => {
    const dayRequests = requests.filter(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      
      return isWithinInterval(day, { start, end }) ||
             isSameDay(day, start) || 
             isSameDay(day, end);
    });
    
    const hasRequests = dayRequests.length > 0;
    
    return (
      <div className={`relative p-2 w-full text-center ${hasRequests ? 'font-bold' : ''}`}>
        {day.getDate()}
        {hasRequests && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="h-1 w-1 rounded-full bg-blue-500"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Calendar 
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border rounded-md p-3 pointer-events-auto"
            components={{
              Day: ({ day, ...props }) => (
                <button
                  {...props}
                  className={props.className}
                >
                  {renderDay(day)}
                </button>
              )
            }}
          />
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {selectedDate ? (
                <span>Equipment for {selectedDate.toLocaleDateString()}</span>
              ) : (
                <span>Select a date to see equipment</span>
              )}
            </h3>
            {selectedDateRequests.length > 0 ? (
              <ul className="space-y-3">
                {selectedDateRequests.map(request => {
                  const equipmentItem = equipment.find(e => e.id === request.equipmentId);
                  return (
                    <li 
                      key={request.id}
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/requests`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{equipmentItem?.name || 'Unknown Equipment'}</p>
                          <p className="text-sm text-gray-500">Requested by: {request.userName}</p>
                          <p className="text-sm text-gray-500">Purpose: {request.purpose}</p>
                        </div>
                        <Badge className={
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {request.status}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No equipment scheduled for this day</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
