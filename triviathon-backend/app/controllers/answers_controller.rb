class AnswersController < ApplicationController
    def index
        answers = Answer.all 
        render json: answers
    end

    def show
        answer = answer.find_by(id: params[:id])
        render json: answer
    end
    
    
    def create
        answer = Answer.create(question: params[:question], user_id: params[:user_id], correct: params[:correct], content: params[:content])
        render json: answer
    end

end
