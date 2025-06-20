import React, { useState, useEffect } from 'react';
import buildingData from '../assets/competitionData/건축_건설_인테리어.json';
import designData from '../assets/competitionData/디자인_순수미술_공예.json';

export default function Competitions() {
    const [activeTab, setActiveTab] = useState('building');
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        // 탭이 변경될 때마다 해당하는 데이터를 로드
        setCompetitions(activeTab === 'building' ? buildingData : designData);
    }, [activeTab]);

    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-8">공모전 정보</h1>
            
            {/* 탭 메뉴 */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('building')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        activeTab === 'building'
                            ? 'bg-yellow-point text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    건축/건설/인테리어
                </button>
                <button
                    onClick={() => setActiveTab('design')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        activeTab === 'design'
                            ? 'bg-yellow-point text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    디자인/순수미술/공예
                </button>
            </div>

            {/* 공모전 목록 */}
            <div className="grid grid-cols-3 gap-6">
                {competitions.map((competition, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-xl border border-gray-200 hover:border-yellow-point transition-colors duration-200"
                    >
                        <h3 className="text-xl font-bold mb-2">{competition.제목}</h3>
                        <p className="text-gray-600 mb-2">주최: {competition.주최}</p>
                        <div className="flex flex-col gap-1 text-sm text-gray-500">
                            <span>시상금: {competition.시상규모}</span>
                            <span>접수기간: {competition.접수기간.시작일} ~ {competition.접수기간.마감일}</span>
                            <span>참여대상: {competition.참여대상}</span>
                            <span>활동혜택: {competition.활동혜택}</span>
                        </div>
                        {competition.홈페이지 !== '-' && (
                            <a 
                                href={competition.홈페이지}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                자세히 보기
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 