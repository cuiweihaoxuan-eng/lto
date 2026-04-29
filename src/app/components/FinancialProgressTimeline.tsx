import React, { useState, useRef, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { FinancialProgressDetailDialog } from "./FinancialProgressDetailDialog";

interface TimelineEvent {
  id: string;
  name: string;
  amount: number;
  date: string;
  progress: number;
  type: 'plan' | 'actual'; // 区分计划和实际
  hasActual?: boolean; // 计划是否有对应的实际数据
  details?: {
    description?: string;
    status?: string;
    relatedItems?: string[];
  };
}

interface TimelineData {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  planColor: string; // 计划颜色
  actualColor: string; // 实际颜色
  events: TimelineEvent[];
}

// Tooltip component for event dots
interface TooltipProps {
  event: TimelineEvent;
  color: string;
  visible: boolean;
  position: { x: number; y: number };
}

function EventTooltip({ event, color, visible, position }: TooltipProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%) translateY(-10px)'
      }}
    >
      <div 
        className="bg-white border-2 rounded-lg p-3 shadow-lg min-w-[180px]"
        style={{ borderColor: color }}
      >
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-medium text-gray-500">
            {event.type === 'plan' ? '计划' : '实际'}
          </span>
        </div>
        <div className="text-sm font-medium text-gray-700 mb-1">{event.name}</div>
        <div className="text-base font-semibold mb-1" style={{ color }}>
          ¥{event.amount.toLocaleString('zh-CN')}
        </div>
        <div className="text-xs text-gray-500 mb-2">{event.date}</div>
        <div className="flex items-center gap-1">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full"
              style={{ 
                width: `${event.progress}%`,
                backgroundColor: color
              }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color }}>
            {event.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

// Progress Ring Component
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  isPlan: boolean;
}

function ProgressRing({ progress, size = 24, strokeWidth = 3, color, isPlan }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={isPlan ? '#e5e7eb' : '#f3f4f6'}
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 0.3s ease',
          opacity: isPlan ? 0.6 : 1
        }}
      />
      {/* Center dot for actual */}
      {!isPlan && (
        <circle
          cx={center}
          cy={center}
          r={radius * 0.35}
          fill={color}
          className="transform rotate-90"
          style={{ transformOrigin: 'center' }}
        />
      )}
      {/* Center ring for plan */}
      {isPlan && (
        <circle
          cx={center}
          cy={center}
          r={radius * 0.35}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.7}
          className="transform rotate-90"
          style={{ transformOrigin: 'center', opacity: 0.6 }}
        />
      )}
    </svg>
  );
}

export function FinancialProgressTimeline() {
  const [scale, setScale] = useState(1);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<{ event: TimelineEvent; lineType: string } | null>(null);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollStartX, setScrollStartX] = useState(0);
  const [hoveredEvent, setHoveredEvent] = useState<{ event: TimelineEvent; color: string; position: { x: number; y: number } } | null>(null);

  // Mock data for four timelines
  const timelinesData: TimelineData[] = [
    {
      label: "收入",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "#52c41a",
      bgColor: "#f6ffed",
      planColor: "#b7eb8f",
      actualColor: "#52c41a",
      events: [
        { 
          id: "inc-p1", 
          name: "首季度营收确认", 
          amount: 250000, 
          date: "2024-01-15", 
          progress: 100,
          type: 'plan',
          hasActual: true, // 有对应实际数据
          details: {
            description: "第一季度营业收入确认计划",
            status: "计划",
            relatedItems: ["产品收入测", "服务收入"]
          }
        },
        { 
          id: "inc-a1", 
          name: "首季度营收确认-实际", 
          amount: 250000, 
          date: "2024-01-20", 
          progress: 85,
          type: 'actual',
          details: {
            description: "第一季度营业收入确认，已完成大部分收入确认工作",
            status: "进行中",
            relatedItems: ["产品收入测", "服务收入"]
          }
        },
        { 
          id: "inc-p2", 
          name: "年中盈利确认", 
          amount: 480000, 
          date: "2024-06-01", 
          progress: 100,
          type: 'plan',
          hasActual: true, // 有对应实际数据
          details: {
            description: "年中盈利确认计划",
            status: "计划中",
            relatedItems: ["协议级项目", "合同收入"]
          }
        },
        { 
          id: "inc-a2", 
          name: "年中盈利确认-实际", 
          amount: 460000, 
          date: "2024-06-15", 
          progress: 20,
          type: 'actual',
          details: {
            description: "年中盈利确认实际",
            status: "进行中",
            relatedItems: ["协议级项目", "合同收入"]
          }
        },
        { 
          id: "inc-p3", 
          name: "第三季度收入", 
          amount: 380000, 
          date: "2024-09-01", 
          progress: 100,
          type: 'plan',
          hasActual: false, // 仅有计划，没有实际数据
          details: {
            description: "第三季度收入计划",
            status: "计划中",
            relatedItems: ["新项目", "扩展业务"]
          }
        }
      ]
    },
    {
      label: "支出",
      icon: <TrendingDown className="w-4 h-4" />,
      color: "#ff4d4f",
      bgColor: "#fff2f0",
      planColor: "#ffaaa5",
      actualColor: "#ff4d4f",
      events: [
        { 
          id: "exp-p1", 
          name: "原材料及采购费", 
          amount: 320000, 
          date: "2024-03-15", 
          progress: 100,
          type: 'plan',
          details: {
            description: "原材料及设备采购支出计划",
            status: "计划",
            relatedItems: ["设备采购", "原材料采购"]
          }
        },
        { 
          id: "exp-a1", 
          name: "原材料及采购费-实际", 
          amount: 320000, 
          date: "2024-03-20", 
          progress: 100,
          type: 'actual',
          details: {
            description: "原材料及设备采购支出",
            status: "已完成",
            relatedItems: ["设备采购", "原材料采购"]
          }
        },
        { 
          id: "exp-p2", 
          name: "年中运营成本", 
          amount: 180000, 
          date: "2024-07-01", 
          progress: 100,
          type: 'plan',
          details: {
            description: "年中运营成本支出计划",
            status: "计划中",
            relatedItems: ["人力成本", "运营费用"]
          }
        },
        { 
          id: "exp-a2", 
          name: "年中运营成本-实际", 
          amount: 195000, 
          date: "2024-07-05", 
          progress: 45,
          type: 'actual',
          details: {
            description: "年中运营成本支出",
            status: "进行中",
            relatedItems: ["人力成本", "运营费用"]
          }
        }
      ]
    },
    {
      label: "收款",
      icon: <DollarSign className="w-4 h-4" />,
      color: "#1890ff",
      bgColor: "#e6f7ff",
      planColor: "#91d5ff",
      actualColor: "#1890ff",
      events: [
        { 
          id: "rec-p1", 
          name: "核心项目一期收款", 
          amount: 150000, 
          date: "2024-02-01", 
          progress: 100,
          type: 'plan',
          hasActual: true, // 有对应实际数据
          details: {
            description: "核心项目第一期款项收款计划",
            status: "计划",
            relatedItems: ["mn运项目", "协议项目"]
          }
        },
        { 
          id: "rec-a1", 
          name: "核心项目一期收款-实际", 
          amount: 150000, 
          date: "2024-02-10", 
          progress: 60,
          type: 'actual',
          details: {
            description: "核心项目第一期款项收款",
            status: "部分收款",
            relatedItems: ["mn运项目", "协议项目"]
          }
        },
        { 
          id: "rec-p2", 
          name: "项目二期回款", 
          amount: 280000, 
          date: "2024-05-15", 
          progress: 100,
          type: 'plan',
          hasActual: true, // 有对应实际数据
          details: {
            description: "项目第二期回款计划",
            status: "计划",
            relatedItems: ["协议级项目"]
          }
        },
        { 
          id: "rec-a2", 
          name: "项目二期回款-实际", 
          amount: 280000, 
          date: "2024-05-25", 
          progress: 30,
          type: 'actual',
          details: {
            description: "项目第二期回款计划",
            status: "待收款",
            relatedItems: ["协议级项目"]
          }
        },
        { 
          id: "rec-p3", 
          name: "年度尾款收款", 
          amount: 350000, 
          date: "2024-11-15", 
          progress: 100,
          type: 'plan',
          hasActual: false, // 仅有计划，没有实际数据
          details: {
            description: "年度项目尾款收款计划",
            status: "计划中",
            relatedItems: ["全年项目总结"]
          }
        }
      ]
    },
    {
      label: "付款",
      icon: <CreditCard className="w-4 h-4" />,
      color: "#722ed1",
      bgColor: "#f9f0ff",
      planColor: "#d3adf7",
      actualColor: "#722ed1",
      events: [
        { 
          id: "pay-p1", 
          name: "季度设备及物业费", 
          amount: 85000, 
          date: "2024-03-25", 
          progress: 100,
          type: 'plan',
          hasActual: true, // 有对应实际数据
          details: {
            description: "季度设备维护及物业费用支付计划",
            status: "计划",
            relatedItems: ["设备维护", "物业费用"]
          }
        },
        { 
          id: "pay-a1", 
          name: "季度设备及物业费-实际", 
          amount: 85000, 
          date: "2024-04-01", 
          progress: 90,
          type: 'actual',
          details: {
            description: "季度设备维护及物业费用支付",
            status: "即将完成",
            relatedItems: ["设备维护", "物业费用"]
          }
        },
        { 
          id: "pay-p2", 
          name: "供应商结算", 
          amount: 220000, 
          date: "2024-08-10", 
          progress: 100,
          type: 'plan',
          hasActual: true, // 有对应实际数据
          details: {
            description: "供应商货款结算计划",
            status: "计划中",
            relatedItems: ["供应商A", "供应商B"]
          }
        },
        { 
          id: "pay-a2", 
          name: "供应商结算-实际", 
          amount: 220000, 
          date: "2024-08-15", 
          progress: 25,
          type: 'actual',
          details: {
            description: "供应商货款结算",
            status: "部分支付",
            relatedItems: ["供应商A", "供应商B"]
          }
        },
        { 
          id: "pay-p3", 
          name: "年度审计费用", 
          amount: 120000, 
          date: "2024-12-20", 
          progress: 100,
          type: 'plan',
          hasActual: false, // 仅有计划，没有实际数据
          details: {
            description: "年度审计费用支付计划",
            status: "计划中",
            relatedItems: ["审计服务", "财务报告"]
          }
        }
      ]
    }
  ];

  // Calculate timeline range
  const allDates = timelinesData.flatMap(timeline => 
    timeline.events.map(event => new Date(event.date).getTime())
  );
  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);
  const dateRange = maxDate - minDate;

  // Generate time axis labels
  const generateTimeAxisLabels = () => {
    const labels = [];
    const startDate = new Date(minDate);
    const endDate = new Date(maxDate);
    
    labels.push({
      date: startDate.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
      position: 0
    });

    // Add monthly markers
    for (let i = 1; i <= 10; i++) {
      const date = new Date(minDate + dateRange * (i / 11));
      labels.push({
        date: date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
        position: (i / 11) * 100
      });
    }
    
    labels.push({
      date: endDate.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
      position: 100
    });

    return labels;
  };

  const timeAxisLabels = generateTimeAxisLabels();

  // Calculate position for an event
  const getEventPosition = (eventDate: string) => {
    const eventTime = new Date(eventDate).getTime();
    return ((eventTime - minDate) / dateRange) * 100;
  };

  // 生成时间线分段（根据事件区分颜色）
  const generateLineSegments = (timeline: TimelineData) => {
    const segments: Array<{ start: number; end: number; color: string }> = [];
    
    // 按时间排序事件
    const sortedEvents = [...timeline.events].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 如果没有事件，返回灰色全线
    if (sortedEvents.length === 0) {
      return [{ start: 0, end: 100, color: '#e5e7eb' }];
    }

    // 从起点到第一个事件
    const firstEventPos = getEventPosition(sortedEvents[0].date);
    if (firstEventPos > 0) {
      segments.push({ 
        start: 0, 
        end: firstEventPos, 
        color: '#e5e7eb' // 灰色
      });
    }

    // 事件之间的线段
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const currentEvent = sortedEvents[i];
      const nextEvent = sortedEvents[i + 1];
      const startPos = getEventPosition(currentEvent.date);
      const endPos = getEventPosition(nextEvent.date);

      // 判断这段时间内的颜色
      // 如果当前事件是实际数据，使用实际颜色
      // 如果当前事件是计划且没有实际数据，使用灰色
      // 如果当前事件是计划且有实际数据，使用计划色
      let segmentColor;
      if (currentEvent.type === 'actual') {
        segmentColor = timeline.actualColor;
      } else if (currentEvent.type === 'plan' && currentEvent.hasActual === false) {
        segmentColor = '#9ca3af'; // 灰色
      } else {
        segmentColor = timeline.planColor;
      }

      segments.push({ start: startPos, end: endPos, color: segmentColor });
    }

    // 从最后一个事件到终点
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    const lastEventPos = getEventPosition(lastEvent.date);
    if (lastEventPos < 100) {
      // 最后一段的颜色取决于最后一个事件
      let lastSegmentColor;
      if (lastEvent.type === 'actual') {
        lastSegmentColor = timeline.actualColor;
      } else if (lastEvent.type === 'plan' && lastEvent.hasActual === false) {
        lastSegmentColor = '#9ca3af'; // 灰色
      } else {
        lastSegmentColor = timeline.planColor;
      }
      
      segments.push({ 
        start: lastEventPos, 
        end: 100, 
        color: lastSegmentColor
      });
    }

    return segments;
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  // Timeline drag handlers
  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.event-dot')) {
      return;
    }
    
    setIsDraggingTimeline(true);
    setDragStartX(e.clientX);
    setScrollStartX(timelineRef.current?.scrollLeft || 0);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingTimeline && timelineRef.current) {
        const deltaX = e.clientX - dragStartX;
        timelineRef.current.scrollLeft = scrollStartX - deltaX;
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTimeline(false);
    };

    if (isDraggingTimeline) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDraggingTimeline, dragStartX, scrollStartX]);

  const handleDotMouseEnter = (event: TimelineEvent, color: string, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setHoveredEvent({
      event,
      color,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      }
    });
  };

  const handleDotMouseLeave = () => {
    setHoveredEvent(null);
  };

  const handleDotClick = (event: TimelineEvent, lineType: string) => {
    setSelectedEvent({ event, lineType });
  };

  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2e7cff] rounded flex items-center justify-center text-white font-bold">财</div>
          <h2 className="text-lg font-medium">形象进度表</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-gray-500">收入确认(万元)</div>
            <div className="text-lg font-medium text-green-600">80%</div>
            <div className="text-xs text-gray-600">320.00 / 400.00</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">支出确认(万元)</div>
            <div className="text-lg font-medium text-red-600">70%</div>
            <div className="text-xs text-gray-600">210.00 / 300.00</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">收款确认(万元)</div>
            <div className="text-lg font-medium text-green-600">80%</div>
            <div className="text-xs text-gray-600">320.00 / 400.00</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">付款确认(万元)</div>
            <div className="text-lg font-medium text-red-600">60%</div>
            <div className="text-xs text-gray-600">180.00 / 300.00</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <ProgressRing progress={75} size={20} strokeWidth={2.5} color="#b7eb8f" isPlan={true} />
          <span className="text-gray-600">计划进度</span>
        </div>
        <div className="flex items-center gap-2">
          <ProgressRing progress={75} size={20} strokeWidth={2.5} color="#52c41a" isPlan={false} />
          <span className="text-gray-600">实际进度</span>
        </div>
      </div>

      {/* Timeline Container with Fixed Labels */}
      <div className="flex gap-4">
        {/* Fixed Labels */}
        <div className="flex-shrink-0 w-24 space-y-3 pt-1">
          {timelinesData.map((timeline, index) => (
            <div key={index} className="h-12 flex items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: timeline.bgColor, color: timeline.color }}
                >
                  {timeline.icon}
                </div>
                <span className="font-medium text-gray-700 text-sm">{timeline.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable Timeline Area */}
        <div 
          className={`flex-1 overflow-x-auto ${isDraggingTimeline ? 'cursor-grabbing' : 'cursor-grab'}`}
          ref={timelineRef}
          onMouseDown={handleTimelineMouseDown}
        >
          <div style={{ minWidth: `${1000 * scale}px` }}>
            {/* Timelines */}
            <div className="space-y-3">
              {timelinesData.map((timeline, index) => {
                const segments = generateLineSegments(timeline);
                
                return (
                  <div key={index} className="relative h-12">
                    {/* Segmented lines */}
                    {segments.map((segment, segIdx) => (
                      <div 
                        key={segIdx}
                        className="absolute top-1/2 -translate-y-1/2 h-1 transition-all duration-300"
                        style={{ 
                          left: `${segment.start}%`,
                          width: `${segment.end - segment.start}%`,
                          backgroundColor: segment.color,
                          opacity: 0.8
                        }}
                      />
                    ))}

                    {/* Event dots */}
                    {timeline.events.map((event) => {
                      const position = getEventPosition(event.date);
                      // 判断颜色：
                      // 1. 如果是实际数据(actual)，使用实际颜色
                      // 2. 如果是计划数据(plan)且没有对应实际数据(hasActual=false)，使用灰色
                      // 3. 如果是计划数据(plan)且有对应实际数据(hasActual=true)，使用计划颜色
                      let ringColor;
                      if (event.type === 'actual') {
                        ringColor = timeline.actualColor;
                      } else if (event.type === 'plan' && event.hasActual === false) {
                        ringColor = '#9ca3af'; // 灰色，表示仅有计划未完成
                      } else {
                        ringColor = timeline.planColor;
                      }
                      
                      return (
                        <div
                          key={event.id}
                          className="event-dot absolute top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform z-10"
                          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
                          onMouseEnter={(e) => handleDotMouseEnter(event, ringColor, e)}
                          onMouseLeave={handleDotMouseLeave}
                          onClick={() => handleDotClick(event, timeline.label)}
                        >
                          <ProgressRing 
                            progress={event.progress} 
                            size={24} 
                            strokeWidth={2.5} 
                            color={ringColor} 
                            isPlan={event.type === 'plan'} 
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Time Axis */}
            <div className="mt-6 pt-3 border-t">
              <div className="relative h-8">
                {/* Axis line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300" />
                
                {/* Time labels */}
                {timeAxisLabels.map((label, index) => (
                  <div
                    key={index}
                    className="absolute top-0"
                    style={{ left: `${label.position}%`, transform: 'translateX(-50%)' }}
                  >
                    {/* Tick mark */}
                    <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-gray-400" style={{ transform: 'translateX(-50%)' }} />
                    
                    {/* Date label */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                      {label.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            拖动时间轴查看更多内容 | 悬停圆点查看详情 | 点击圆点查看完整信息
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">缩放:</span>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>-</Button>
          <span className="text-sm font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>+</Button>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredEvent && (
        <EventTooltip
          event={hoveredEvent.event}
          color={hoveredEvent.color}
          visible={true}
          position={hoveredEvent.position}
        />
      )}

      {/* Detail Dialog */}
      <FinancialProgressDetailDialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent?.event || null}
        lineType={selectedEvent?.lineType || ""}
      />
    </div>
  );
}